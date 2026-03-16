import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig, launchWorkspace2 } from '@openmrs/esm-framework';
import { useLatestValidEncounter } from '../../../hooks/useLatestEncounter'; // Ajusta la ruta
import PatientSummaryTable from '../../../ui/patient-summary-table/patient-summary-table.component'; // Ajusta la ruta
import type { ConfigObject } from '../../../config-schema';
import {
  IMMEDIATE_ASSESSMENT_UUID,
  BIRTH_QUESTIONNAIRE_UUID,
  NEWBORN_EVALUATION_UUID,
  CORD_CLAMPING_UUID,
  SKIN_TO_SKIN_CONTACT_UUID,
  OXYGEN_SUPPORT_UUID,
  VITAMIN_K_ADMIN_UUID,
  HEART_RATE_UUID,
  RESPIRATORY_RATE_UUID,
  OXYGEN_SATURATION_UUID,
  BODY_TEMPERATURE_UUID,
  APGAR_1_MIN_UUID,
  APGAR_5_MIN_UUID,
  APGAR_10_MIN_UUID,
  WEIGHT_UUID,
  HEIGHT_UUID,
  HEAD_CIRCUMFERENCE_UUID,
  CHEST_CIRCUMFERENCE_UUID,
  GASTRIC_LAVAGE_UUID,
  GASTRIC_LAVAGE_COUNT_UUID,
  NURSING_DIAGNOSIS_UUID,
} from '../../concepts/neonatal-concepts';

interface ImmediateNewbornAttentionProps {
  patientUuid: string;
}

const NeonatalAttention: React.FC<ImmediateNewbornAttentionProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('immediateNewbornAttention', 'Atención Inmediata del Recién Nacido');
  const displayText = t('immediateNewbornAttention', 'Atención Inmediata del Recién Nacido');
  const { encounter, isLoading, error, mutate } = useLatestValidEncounter(
    patientUuid,
    config.encounterTypes.atencionInmediata,
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
      form: { uuid: config.formsList.atencionImmediataNewborn },
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
      id: 'immediateAssessment',
      label: t('immediateAssessment', 'Valoración Inmediata del Recién Nacido'),
      dataKey: IMMEDIATE_ASSESSMENT_UUID,
    },
    {
      id: 'birthQuestionnaire',
      label: t('birthQuestionnaire', 'Cuestionario Inmediato para Nacimiento'),
      dataKey: BIRTH_QUESTIONNAIRE_UUID,
    },
    {
      id: 'newbornEvaluation',
      label: t('newbornEvaluation', 'Evaluación del Recién Nacido'),
      dataKey: NEWBORN_EVALUATION_UUID,
    },
    { id: 'cordClamping', label: t('cordClamping', 'Clampado'), dataKey: CORD_CLAMPING_UUID },
    {
      id: 'skinToSkinContact',
      label: t('skinToSkinContact', 'Contacto Piel a Piel'),
      dataKey: SKIN_TO_SKIN_CONTACT_UUID,
    },
    {
      id: 'oxygenSupport',
      label: t('oxygenSupport', 'Soporte de Oxígeno'),
      dataKey: OXYGEN_SUPPORT_UUID,
    },
    {
      id: 'vitaminKAdmin',
      label: t('vitaminKAdmin', 'Administración de Vitamina K'),
      dataKey: VITAMIN_K_ADMIN_UUID,
    },
    { id: 'heartRate', label: t('heartRate', 'Frecuencia Cardíaca'), dataKey: HEART_RATE_UUID },
    {
      id: 'respiratoryRate',
      label: t('respiratoryRate', 'Frecuencia Respiratoria'),
      dataKey: RESPIRATORY_RATE_UUID,
    },
    {
      id: 'oxygenSaturation',
      label: t('oxygenSaturation', 'Saturación de Oxígeno'),
      dataKey: OXYGEN_SATURATION_UUID,
    },
    {
      id: 'bodyTemperature',
      label: t('bodyTemperature', 'Temperatura Corporal'),
      dataKey: BODY_TEMPERATURE_UUID,
    },
    { id: 'apgar1Min', label: t('apgar1Min', 'Apgar 1 Minuto'), dataKey: APGAR_1_MIN_UUID },
    { id: 'apgar5Min', label: t('apgar5Min', 'Apgar 5 Minutos'), dataKey: APGAR_5_MIN_UUID },
    {
      id: 'apgar10Min',
      label: t('apgar10Min', 'Apgar 10 Minutos'),
      dataKey: APGAR_10_MIN_UUID,
    },
    { id: 'weight', label: t('weightKg', 'Weight (kg)'), dataKey: WEIGHT_UUID },
    { id: 'height', label: t('heightCm', 'Height (cm)'), dataKey: HEIGHT_UUID },
    {
      id: 'headCircumference',
      label: t('headCircumferenceCm', 'Head circumference (cm)'),
      dataKey: HEAD_CIRCUMFERENCE_UUID,
    },
    {
      id: 'chestCircumference',
      label: t('chestCircumferenceCm', 'Chest circumference (cm)'),
      dataKey: CHEST_CIRCUMFERENCE_UUID,
    },
    {
      id: 'gastricLavage',
      label: t('gastricLavage', 'Lavado Gástrico'),
      dataKey: GASTRIC_LAVAGE_UUID,
    },
    {
      id: 'gastricLavageCount',
      label: t('gastricLavageCount', 'Cantidad de Lavados Gástricos'),
      dataKey: GASTRIC_LAVAGE_COUNT_UUID,
    },
    {
      id: 'nursingDiagnosis',
      label: t('nursingDiagnosis', 'Diagnóstico de Enfermería'),
      dataKey: NURSING_DIAGNOSIS_UUID,
    },
  ];

  return (
    <PatientSummaryTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={displayText}
      dataHook={dataHook}
      rowConfig={rowConfig}
      onFormLaunch={handleLaunchForm}
    />
  );
};

export default NeonatalAttention;
