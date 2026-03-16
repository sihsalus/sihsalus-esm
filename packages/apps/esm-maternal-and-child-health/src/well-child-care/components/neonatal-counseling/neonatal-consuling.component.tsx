import { launchWorkspace2, useConfig } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ConfigObject } from '../../../config-schema';
import { useLatestValidEncounter } from '../../../hooks/useLatestEncounter'; // Ajusta la ruta
import PatientSummaryTable from '../../../ui/patient-summary-table/patient-summary-table.component'; // Ajusta la ruta
import {
  EXAM_DATE_UUID,
  BODY_POSITION_UUID,
  RESPONSES_UUID,
  AFFECTIVE_BOND_UUID,
  ANATOMY_UUID,
  SUCTION_COUNSEL_UUID,
  TIME_UUID,
  FEEDING_TIME_UUID,
  OBSERVATION_UUID,
} from '../../concepts/neonatal-concepts';

interface NeonatalCounselingProps {
  patientUuid: string;
}

const NeonatalCounseling: React.FC<NeonatalCounselingProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('neonatalCounseling', 'Consejeria Lactancia Materna');
  const { encounter, isLoading, error, mutate } = useLatestValidEncounter(
    patientUuid,
    config.encounterTypes.consejeriaMaterna,
  );

  // Procesar observaciones, manejando múltiples valores para checkboxes
  const obsData = React.useMemo(() => {
    if (!encounter?.obs) return {};
    const obsMap: { [key: string]: string | string[] } = {};
    encounter.obs.forEach((obs) => {
      const conceptUuid = obs.concept.uuid;
      const value =
        obs.value && typeof obs.value === 'object' && 'display' in obs.value ? obs.value.display : obs.value;
      if (obsMap[conceptUuid]) {
        // Si ya existe, convertir a array para checkboxes
        obsMap[conceptUuid] = Array.isArray(obsMap[conceptUuid])
          ? [...obsMap[conceptUuid], value]
          : [obsMap[conceptUuid], value];
      } else {
        obsMap[conceptUuid] = value;
      }
    });
    return obsMap;
  }, [encounter]);

  const handleLaunchForm = () => {
    launchWorkspace2('patient-form-entry-workspace', {
      form: { uuid: config.formsList.breastfeedingObservation },
      encounterUuid: encounter?.uuid || '',
    });
    setTimeout(() => mutate(), 1000); // Forzar revalidación
  };

  const dataHook = () => ({
    data: encounter ? [obsData] : [],
    isLoading,
    error,
    mutate,
  });

  const rowConfig = [
    {
      id: 'examDate',
      label: t('examDate', 'Fecha y Hora de Inicio del Examen'),
      dataKey: EXAM_DATE_UUID,
    },
    {
      id: 'bodyPosition',
      label: t('bodyPosition', 'Posición del Cuerpo'),
      dataKey: BODY_POSITION_UUID,
    },
    { id: 'responses', label: t('responses', 'Respuestas'), dataKey: RESPONSES_UUID },
    {
      id: 'affectiveBond',
      label: t('affectiveBond', 'Vínculo Afectivo'),
      dataKey: AFFECTIVE_BOND_UUID,
    },
    { id: 'anatomy', label: t('anatomy', 'Anatomía'), dataKey: ANATOMY_UUID },
    { id: 'suction', label: t('suction', 'Succión'), dataKey: SUCTION_COUNSEL_UUID },
    { id: 'time', label: t('time', 'Tiempo'), dataKey: TIME_UUID },
    {
      id: 'feedingTime',
      label: t('feedingTime', 'Tiempo que el Bebé Mamó (min)'),
      dataKey: FEEDING_TIME_UUID,
    },
    { id: 'notes', label: t('notes', 'Notas'), dataKey: OBSERVATION_UUID },
  ];

  return (
    <PatientSummaryTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={t('neonatalCounseling', 'Consejeria Lactancia Materna')}
      dataHook={dataHook}
      rowConfig={rowConfig}
      onFormLaunch={handleLaunchForm}
    />
  );
};

export default NeonatalCounseling;
