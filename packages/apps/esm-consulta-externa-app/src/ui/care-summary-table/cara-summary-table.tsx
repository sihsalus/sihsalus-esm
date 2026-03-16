import React, { useCallback, useMemo } from 'react';
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  InlineLoading,
  Button,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import {
  CardHeader,
  EmptyState,
  usePatientChartStore,
  launchStartVisitPrompt,
} from '@openmrs/esm-patient-common-lib';
import { launchWorkspace } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import styles from './care-summary-table.scss';
import { Add } from '@carbon/react/icons';

interface Encounter {
  encounterDatetime: string;
  obs: {
    display: string;
    groupMembers?: {
      display: string;
    }[];
  }[];
}

interface RowDefinition {
  id: string;
  rowHeader: string;
  prefix: string;
}

interface RowData {
  id: string;
  rowHeader: string;
  [key: string]: string;
}

interface CareSummaryTableProps {
  patientUuid: string;
  title: string;
  emptyStateText: string;
  formUuid: string;
  useEncountersHook: (uuid: string) => {
    prenatalEncounters: Encounter[];
    isValidating: boolean;
    mutate: () => void;
  };
  rowDefinitions: RowDefinition[];
  headerPrefix?: string;
  customHeaderTransform?: (index: number) => JSX.Element;
}

const CareSummaryTable: React.FC<CareSummaryTableProps> = ({
  patientUuid,
  title,
  emptyStateText,
  formUuid,
  useEncountersHook,
  rowDefinitions,
  customHeaderTransform,
}) => {
  const { t } = useTranslation();
  const { prenatalEncounters, isValidating, mutate } = useEncountersHook(patientUuid);
  const { visitContext: currentVisit } = usePatientChartStore(patientUuid);

  const launchForm = useCallback(() => {
    try {
      if (!currentVisit) {
        launchStartVisitPrompt();
      } else {
        if (formUuid) {
          launchWorkspace('patient-form-entry-workspace', {
            workspaceTitle: title,
            mutateForm: mutate,
            formInfo: { formUuid, patientUuid, additionalProps: {} },
          });
        }
      }
      if (mutate) {
        setTimeout(() => mutate(), 1000);
      }
    } catch (err) {
      console.error('Failed to launch form:', err);
    }
  }, [patientUuid, currentVisit, formUuid, title, mutate]);

  const activeRows = useMemo(() => {
    if (!prenatalEncounters || prenatalEncounters.length === 0) {
      return rowDefinitions.slice(0, 5);
    }

    const seenPrefixes = new Set<string>();
    seenPrefixes.add('encounterDatetime');

    prenatalEncounters.forEach((encounter) => {
      encounter.obs.forEach((obs) => {
        (obs.groupMembers || []).forEach((member) => {
          rowDefinitions.forEach((row) => {
            if (member.display.startsWith(row.prefix)) {
              seenPrefixes.add(row.prefix);
            }
          });
        });
      });
    });

    return rowDefinitions.filter((row) => seenPrefixes.has(row.prefix));
  }, [prenatalEncounters, rowDefinitions]);

  const maxEncounters = useMemo(() => {
    if (!prenatalEncounters || prenatalEncounters.length === 0) return 9;

    let max = 0;
    prenatalEncounters.forEach((encounter) => {
      encounter.obs.forEach((obs) => {
        const match = obs.display.match(/Atenci[oó]n (?:prenatal|puerperio) (\d+)/);
        if (match) {
          const n = parseInt(match[1], 10);
          if (n > max) max = n;
        }
      });
    });

    return Math.max(max + 1, 9);
  }, [prenatalEncounters]);

  const tableHeaders = useMemo(() => {
    return [
      { key: 'rowHeader', header: t('Atenciones', 'Atenciones') },
      ...Array.from({ length: maxEncounters }, (_, i) => ({
        key: `atencion${i + 1}`,
        header: customHeaderTransform ? customHeaderTransform(i + 1) : t(`atencion${i + 1}`, `Atención ${i + 1}`),
      })),
    ];
  }, [t, maxEncounters, customHeaderTransform]);

  const tableRows = useMemo(() => {
    const base: RowData[] = activeRows.map((row) => ({
      id: row.id,
      rowHeader: row.rowHeader,
      ...Object.fromEntries(Array.from({ length: maxEncounters }, (_, i) => [`atencion${i + 1}`, '--'])),
    }));

    const extractValue = (d: string) => d.split(': ').slice(1).join(': ') || d;

    prenatalEncounters.forEach((encounter, i) => {
      let encounterNumber = i + 1;

      encounter.obs.forEach((obs) => {
        const match = obs.display.match(/Atenci[oó]n (?:prenatal|puerperio) (\d+)/);
        if (match) {
          encounterNumber = parseInt(match[1], 10);
        }
      });

      const dateRow = base.find((r) => r.id === 'fecha');
      if (dateRow) {
        dateRow[`atencion${encounterNumber}`] = dayjs(encounter.encounterDatetime).format('DD/MM/YYYY HH:mm');
      }

      encounter.obs.forEach((obs) => {
        (obs.groupMembers || []).forEach((member) => {
          activeRows.forEach((row) => {
            if (member.display.startsWith(row.prefix)) {
              const rowRef = base.find((r) => r.id === row.id);
              if (rowRef) {
                rowRef[`atencion${encounterNumber}`] = extractValue(member.display);
              }
            }
          });
        });
      });
    });

    return base;
  }, [prenatalEncounters, activeRows, maxEncounters]);

  return (
    <div className={styles.widgetCard}>
      {prenatalEncounters.length > 0 ? (
        <>
          <CardHeader title={title}>
            {isValidating && <InlineLoading />}
            <Button kind="ghost" renderIcon={(props) => <Add size={16} {...props} />} onClick={launchForm}>
              {t('add', 'Añadir')}
            </Button>
          </CardHeader>
          <DataTable rows={tableRows} headers={tableHeaders} isSortable useZebraStyles size="sm">
            {({ rows, headers, getHeaderProps, getTableProps }) => (
              <TableContainer>
                <Table {...getTableProps()} aria-label={title}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader key={header.key} {...getHeaderProps({ header })}>
                          {header.header?.content ?? header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </>
      ) : (
        <EmptyState headerTitle={title} displayText={emptyStateText} launchForm={launchForm} />
      )}
    </div>
  );
};

export default CareSummaryTable;
