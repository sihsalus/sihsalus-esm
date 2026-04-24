import { Tab, TabList, TabPanel, TabPanels, Tabs, Tag, type TagProps } from '@carbon/react';
import {
  type AssignedExtension,
  Extension,
  ExtensionSlot,
  formatTime,
  parseDate,
  useAssignedExtensions,
  useConfig,
  useLayoutType,
  type Visit,
} from '@openmrs/esm-framework';
import type { ExternalOverviewProps } from '@openmrs/esm-patient-common-lib';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  type Diagnosis,
  type Encounter,
  mapEncounters,
  type Note,
  type Observation,
  type Order,
  type OrderItem,
} from '../visit.resource';

import MedicationSummary from './medications-summary.component';
import NotesSummary from './notes-summary.component';
import TestsSummary from './tests-summary.component';
import styles from './visit-summary.scss';
import VisitsTable from './visits-table/visits-table.component';

interface DiagnosisItem {
  diagnosis: string;
  rank: number;
  type: NonNullable<TagProps<'div'>['type']>;
  voided?: boolean;
}

interface VisitSummaryProps {
  visit: Visit;
  patientUuid: string;
}

const visitSummaryPanelSlot = 'visit-summary-panels';

const VisitSummary: React.FC<VisitSummaryProps> = ({ visit, patientUuid }) => {
  const config = useConfig();
  const { t } = useTranslation();
  const extensions = useAssignedExtensions(visitSummaryPanelSlot);
  const layout = useLayoutType();
  const encounters = useMemo(() => (visit?.encounters ?? []) as unknown as Array<Encounter>, [visit?.encounters]);

  const [diagnoses, notes, medications]: [Array<DiagnosisItem>, Array<Note>, Array<OrderItem>] = useMemo(() => {
    // Medication Tab
    const medications: Array<OrderItem> = [];
    // Diagnoses in a Visit
    const diagnoses: Array<DiagnosisItem> = [];
    // Notes Tab
    const notes: Array<Note> = [];

    encounters.forEach((enc) => {
      if (Array.isArray(enc.orders)) {
        medications.push(
          ...enc.orders.map((order: Order) => ({
            order,
            provider: {
              name: enc.encounterProviders.length ? enc.encounterProviders[0].provider.person.display : '',
              role: enc.encounterProviders.length ? enc.encounterProviders[0].encounterRole.display : '',
            },
          })),
        );
      }

      // Check if there is a diagnosis associated with this encounter
      if (Array.isArray(enc.diagnoses)) {
        if (enc.diagnoses.length > 0) {
          const validDiagnoses = enc.diagnoses
            .filter((diagnosis: Diagnosis) => !diagnosis.voided)
            .map((diagnosis: Diagnosis) => ({
              diagnosis: diagnosis.display,
              type: diagnosis.rank === 1 ? ('red' as const) : ('blue' as const),
              rank: diagnosis.rank,
              voided: diagnosis.voided,
            }));
          diagnoses.push(...validDiagnoses);
        }
      }

      // Check for Visit Diagnoses and Notes
      if (Array.isArray(enc.obs)) {
        enc.obs.forEach((obs: Observation) => {
          if (config.notesConceptUuids?.includes(obs.concept.uuid)) {
            // Putting all notes in a single array.
            notes.push({
              note: typeof obs.value === 'string' ? obs.value : '',
              provider: {
                name: enc.encounterProviders.length ? enc.encounterProviders[0].provider.person.display : '',
                role: enc.encounterProviders.length ? enc.encounterProviders[0].encounterRole.display : '',
              },
              time: enc.encounterDatetime ? formatTime(parseDate(enc.encounterDatetime)) : '',
              concept: obs.concept,
            });
          }
        });
      }
    });

    // Sort the diagnoses by rank, so that primary diagnoses come first
    diagnoses.sort((a, b) => a.rank - b.rank);

    return [diagnoses, notes, medications];
  }, [config.notesConceptUuids, encounters]);

  const testsFilter = useMemo<ExternalOverviewProps['filter']>(() => {
    const encounterIds = encounters.map((e) => `Encounter/${e.uuid}`);
    return ([entry]) => {
      return encounterIds.includes(entry.encounter?.reference);
    };
  }, [encounters]);

  return (
    <div className={styles.summaryContainer}>
      <p className={styles.diagnosisLabel}>{t('diagnoses', 'Diagnoses')}</p>
      <div className={styles.diagnosesList}>
        {diagnoses.length > 0 ? (
          diagnoses.map((diagnosis, i) => (
            <Tag key={`${diagnosis.diagnosis}-${i}`} type={diagnosis.type}>
              {diagnosis.diagnosis}
            </Tag>
          ))
        ) : (
          <p className={classNames(styles.bodyLong01, styles.text02)} style={{ marginBottom: '0.5rem' }}>
            {t('noDiagnosesFound', 'No diagnoses found')}
          </p>
        )}
      </div>
      <div className={classNames(styles.verticalTabs, layout === 'tablet' ? styles.tabletTabs : styles.desktopTabs)}>
        <Tabs>
          <TabList aria-label="Visit summary tabs" className={styles.tablist}>
            <Tab
              className={classNames(styles.tab, styles.bodyLong01)}
              id="notes-tab"
              disabled={notes.length <= 0 && config.disableEmptyTabs}
            >
              {t('notes', 'Notes')}
            </Tab>
            <Tab className={styles.tab} id="tests-tab" disabled={testsFilter.length <= 0 && config.disableEmptyTabs}>
              {t('tests', 'Tests')}
            </Tab>
            <Tab
              className={styles.tab}
              id="medications-tab"
              disabled={medications.length <= 0 && config.disableEmptyTabs}
            >
              {t('medications', 'Medications')}
            </Tab>
            <Tab
              className={styles.tab}
              id="encounters-tab"
              disabled={encounters.length <= 0 && config.disableEmptyTabs}
            >
              {t('encounters_title', 'Encounters')}
            </Tab>
            {extensions?.map((extension, index) => (
              <Tab
                key={`${extension.moduleName}-${extension.meta.title || index}`}
                className={styles.tab}
                id={`${extension.meta.title || index}-tab`}
              >
                {t(extension.meta.title, {
                  ns: extension.moduleName,
                  defaultValue: extension.meta.title,
                })}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel>
              <NotesSummary notes={notes} />
            </TabPanel>
            <TabPanel>
              <TestsSummary patientUuid={patientUuid} encounters={encounters} />
            </TabPanel>
            <TabPanel>
              <MedicationSummary medications={medications} />
            </TabPanel>
            <TabPanel>
              <VisitsTable visits={mapEncounters(visit)} showAllEncounters={false} patientUuid={patientUuid} />
            </TabPanel>
            {extensions?.map((extension) => (
              <TabPanel key={extension.id}>
                <ExtensionSlot name={visitSummaryPanelSlot}>
                  {(assignedExtension: AssignedExtension) =>
                    assignedExtension.id === extension.id ? <Extension state={{ patientUuid, visit }} /> : null
                  }
                </ExtensionSlot>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default VisitSummary;
