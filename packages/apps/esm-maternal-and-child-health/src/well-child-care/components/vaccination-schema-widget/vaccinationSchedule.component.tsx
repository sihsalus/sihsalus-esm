import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  InlineLoading,
} from '@carbon/react';
import { ErrorState, CardHeader } from '@openmrs/esm-patient-common-lib';
import { Add } from '@carbon/react/icons';
import { useImmunizations } from '../../../hooks/useImmunizations';
import { useAgeRanges } from '../../../hooks/useAgeRanges';
import { useVaccinationSchema } from '../../../hooks/useVaccinationSchema';
import { launchWorkspace2, showSnackbar, useConfig, usePatient } from '@openmrs/esm-framework';
import styles from './vaccination-schedule.scss';
import { type ConfigObject } from '../../../config-schema';

interface VaccinationData {
  status: 'pending' | 'completed' | 'overdue' | 'scheduled' | 'not-applicable';
  date: string;
}

interface Vaccine {
  id: string;
  name: string;
}

interface AgeRange {
  id: string;
  name: string;
  months: number;
}

interface VaccinationScheduleProps {
  patientUuid: string;
}

const processVaccinationData = (
  immunizations: Array<Record<string, any>> | null,
  vaccines: Vaccine[],
  ageRanges: AgeRange[],
  patientAgeInMonths: number,
  vaccinationSchema: Record<string, Record<string, VaccinationData>>,
): Record<string, Record<string, VaccinationData>> => {
  const schema = JSON.parse(JSON.stringify(vaccinationSchema)); // Deep copy of dynamic schema
  const completedDoses: Record<string, number> = {};

  immunizations?.forEach((immunization) => {
    const vaccine = vaccines.find((v) => v.name === immunization.vaccineName);
    if (!vaccine || !immunization.existingDoses?.length) return;

    const dose = immunization.existingDoses[0];
    const date = new Date(dose.occurrenceDateTime);
    const ageAtDose = Math.floor(
      (date.getTime() - new Date(immunization.patientBirthDate).getTime()) / (1000 * 60 * 60 * 24 * 30),
    );
    const ageRange = ageRanges.find((range) => Math.abs(ageAtDose - range.months) <= 1)?.id || 'rn';

    if (schema[vaccine.id]?.[ageRange]) {
      schema[vaccine.id][ageRange] = {
        status: 'completed',
        date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      };
      completedDoses[vaccine.id] = (completedDoses[vaccine.id] || 0) + 1;
    }
  });

  Object.keys(schema).forEach((vaccineId) => {
    const expectedDoses = Object.keys(schema[vaccineId]).length;
    const completed = completedDoses[vaccineId] || 0;
    Object.entries<VaccinationData>(schema[vaccineId]).forEach(([rangeId, data]) => {
      const range = ageRanges.find((r) => r.id === rangeId);
      if (!range) return;

      if (data.status === 'pending' && patientAgeInMonths > range.months + 1) {
        schema[vaccineId][rangeId].status = 'overdue';
      } else if (data.status === 'pending' && completed < expectedDoses && patientAgeInMonths >= range.months - 1) {
        schema[vaccineId][rangeId].status = 'scheduled';
      }
    });
  });

  return schema;
};

const VaccinationSchedule: React.FC<VaccinationScheduleProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const { patient } = usePatient(patientUuid);
  const {
    data: immunizations,
    isLoading: isLoadingImmunizations,
    error: errorImmunizations,
    mutate: mutateImmunizations,
  } = useImmunizations(patientUuid);
  const { data: ageRanges = [], isLoading: isLoadingAgeRanges, error: errorAgeRanges } = useAgeRanges();
  const {
    data: { vaccines = [], schema: vaccinationSchema = {} },
    isLoading: isLoadingVaccines,
    error: errorVaccines,
    mutate: mutateVaccines,
  } = useVaccinationSchema();

  const headerTitle = t('vaccinationSchedule', 'Calendario de Vacunación');

  const patientAgeInMonths = patient?.birthDate
    ? Math.floor((Date.now() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 8;

  const isLoading = isLoadingImmunizations || isLoadingAgeRanges || isLoadingVaccines;
  const error = errorImmunizations || errorAgeRanges || errorVaccines;

  const vaccinationData = useMemo(
    () => processVaccinationData(immunizations, vaccines, ageRanges, patientAgeInMonths, vaccinationSchema),
    [immunizations, vaccines, ageRanges, patientAgeInMonths, vaccinationSchema],
  );

  const tableHeaders = useMemo(
    () => [
      { key: 'vaccine', header: t('vaccine', 'Vacuna') },
      ...ageRanges.map((range) => ({ key: range.id, header: range.name })),
    ],
    [ageRanges, t],
  );

  const tableRows = useMemo(
    () =>
      vaccines.map((vaccine) => {
        const row: Record<string, React.ReactNode> = {
          id: vaccine.id,
          vaccine: (
            <div className={styles.vaccineCell}>
              <span className={styles.vaccineIndicator} aria-hidden="true" />
              <span>{vaccine.name}</span>
            </div>
          ),
        };

        ageRanges.forEach((range) => {
          const vaccineData = vaccinationData[vaccine.id]?.[range.id];
          row[range.id] = vaccineData ? (
            <Tag
              type={getTagType(vaccineData.status)}
              size="sm"
              title={getStatusLabel(vaccineData.status, t)}
              className={styles.vaccineStatusTag}>
              {vaccineData.date || '--'}
            </Tag>
          ) : (
            <span aria-label={t('notApplicable', 'Not applicable')}>--</span>
          );
        });

        return row;
      }),
    [vaccines, vaccinationData, ageRanges, t],
  );

  const handleAddVaccination = useCallback(() => {
    try {
      launchWorkspace2('immunization-form-workspace', {
        patientUuid,
        workspaceTitle: t('addVaccination', 'Añadir Vacuna'),
        mutateForm: () => {
          mutateImmunizations();
          mutateVaccines();
        },
      });
    } catch {
      showSnackbar({
        title: t('immunizationFormNotAvailable', 'Formulario de inmunización no disponible'),
        subtitle: t(
          'immunizationFormNotAvailableSubtitle',
          'El módulo de inmunizaciones no está instalado. Registre vacunas desde el formulario de inmunizaciones del paciente.',
        ),
        kind: 'warning',
      });
    }
  }, [patientUuid, t, mutateImmunizations, mutateVaccines]);

  if (isLoading) {
    return (
      <DataTableSkeleton
        role="progressbar"
        aria-label={t('loadingData', 'Loading data...')}
        headers={tableHeaders}
      />
    );
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  return (
    <div className={styles.widgetCard} role="region" aria-label={headerTitle}>
      <CardHeader title={headerTitle}>
        {isLoading && <InlineLoading description={t('refreshing', 'Refreshing...')} status="active" />}
        <Button
          kind="ghost"
          renderIcon={(props) => <Add size={16} {...props} />}
          onClick={handleAddVaccination}
          aria-label={t('updateVaccinations', 'Actualizar vacunas')}>
          {t('update', 'Actualizar')}
        </Button>
      </CardHeader>

      <DataTable
        rows={tableRows}
        headers={tableHeaders}
        size="sm"
        useZebraStyles
        render={({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer>
            <Table {...getTableProps()} aria-label={t('vaccinationTable', 'Tabla de vacunaciones')}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })} isSortable={false}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
    </div>
  );
};

const getTagType = (status: VaccinationData['status']): string => {
  switch (status) {
    case 'pending':
      return 'blue';
    case 'completed':
      return 'green';
    case 'overdue':
      return 'red';
    case 'scheduled':
      return 'teal';
    case 'not-applicable':
      return 'gray';
    default:
      return 'gray';
  }
};

const getStatusLabel = (
  status: VaccinationData['status'],
  t: (key: string, defaultValue: string) => string,
): string => {
  const statusLabels = {
    pending: t('scheduledDose', 'Scheduled'),
    completed: t('administered', 'Administered'),
    overdue: t('overdue', 'Atrasada'),
    scheduled: t('scheduled', 'Próxima dosis'),
    'not-applicable': t('notApplicable', 'Not applicable'),
  };
  return statusLabels[status] || status;
};

export default VaccinationSchedule;
