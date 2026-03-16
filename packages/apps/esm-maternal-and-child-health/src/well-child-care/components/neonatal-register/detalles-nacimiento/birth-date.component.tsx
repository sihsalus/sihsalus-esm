import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig, launchWorkspace2 } from '@openmrs/esm-framework';
import { useLatestValidEncounter } from '../../../../hooks/useLatestEncounter'; // Ajusta la ruta
import PatientSummaryTable from '../../../../ui/patient-summary-table/patient-summary-table.component'; // Ajusta la ruta
import type { ConfigObject } from '../../../../config-schema';
import {
  GESTATIONAL_AGE_UUID,
  BIRTH_WEIGHT_UUID,
  BIRTH_HEIGHT_UUID,
  HEAD_CIRCUMFERENCE_UUID,
  CHEST_CIRCUMFERENCE_UUID,
  WEIGHT_FOR_GESTATIONAL_AGE_UUID,
  APGAR_1_MIN_UUID,
  APGAR_5_MIN_UUID,
  CONGENITAL_DISEASE_UUID,
  SKIN_TO_SKIN_CONTACT_UUID,
  ROOMING_IN_UUID,
  BREASTFEEDING_FIRST_HOUR_UUID,
  REQUIRED_HOSPITALIZATION_UUID,
  HOSPITALIZATION_TIME_UUID,
} from '../../../concepts/neonatal-concepts';

interface BirthDataProps {
  patientUuid: string;
}

const BirthDataTable: React.FC<BirthDataProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('birthData', 'Datos del Nacimiento');
  const { encounter, isLoading, error, mutate } = useLatestValidEncounter(
    patientUuid,
    config.encounterTypes.antecedentesPerinatales, // Asegúrate de tener este tipo de encounter configurado
  );

  const obsData = React.useMemo(() => {
    if (!encounter?.obs) return {};
    return encounter.obs.reduce((acc, obs) => {
      acc[obs.concept.uuid] = obs.value;
      return acc;
    }, {});
  }, [encounter]);

  const handleLaunchForm = () => {
    launchWorkspace2('patient-form-entry-workspace', {
      form: { uuid: config.formsList.birthDetails },
      encounterUuid: encounter?.uuid || '',
    });
  };

  const dataHook = () => {
    return {
      data: encounter ? [obsData] : [],
      isLoading,
      error,
      mutate,
    };
  };

  const rowConfig = [
    // Datos antropométricos al nacer
    {
      id: 'gestationalAge',
      label: t('gestationalAgeAtBorn', 'Edad Gestacional al Nacer'),
      dataKey: GESTATIONAL_AGE_UUID,
      unit: t('weeks', 'semanas'),
    },
    {
      id: 'birthWeight',
      label: t('birthWeight', 'Peso al Nacer'),
      dataKey: BIRTH_WEIGHT_UUID,
      unit: t('kg', 'kg'),
    },
    {
      id: 'birthHeight',
      label: t('birthHeight', 'Talla al Nacer'),
      dataKey: BIRTH_HEIGHT_UUID,
      unit: t('cm', 'cm'),
    },
    {
      id: 'headCircumference',
      label: t('headCircumference', 'Head circumference'),
      dataKey: HEAD_CIRCUMFERENCE_UUID,
      unit: t('cm', 'cm'),
    },
    {
      id: 'chestCircumference',
      label: t('chestCircumference', 'Chest circumference'),
      dataKey: CHEST_CIRCUMFERENCE_UUID,
      unit: t('cm', 'cm'),
    },
    {
      id: 'weightForGestationalAge',
      label: t('weightForGestationalAge', 'Peso para Edad Gestacional'),
      dataKey: WEIGHT_FOR_GESTATIONAL_AGE_UUID,
    },

    // Evaluaciones APGAR
    {
      id: 'apgar1',
      label: t('apgar1', 'APGAR 1 minuto'),
      dataKey: APGAR_1_MIN_UUID,
      unit: t('points', 'puntos'),
    },
    {
      id: 'apgar5',
      label: t('apgar5', 'APGAR 5 minutos'),
      dataKey: APGAR_5_MIN_UUID,
      unit: t('points', 'puntos'),
    },

    // Condiciones médicas
    {
      id: 'congenitalDisease',
      label: t('congenitalDisease', 'Enfermedad Congénita'),
      dataKey: CONGENITAL_DISEASE_UUID,
    },
    {
      id: 'skinToSkinContact',
      label: t('skinToSkinContact', 'Contacto Piel a Piel'),
      dataKey: SKIN_TO_SKIN_CONTACT_UUID,
    },
    {
      id: 'roomingIn',
      label: t('roomingIn', 'Alojamiento Conjunto'),
      dataKey: ROOMING_IN_UUID,
    },
    {
      id: 'breastfeedingFirstHour',
      label: t('breastfeedingFirstHour', 'Lactancia Primera Hora'),
      dataKey: BREASTFEEDING_FIRST_HOUR_UUID,
    },

    // Hospitalización
    {
      id: 'requiredHospitalization',
      label: t('requiredHospitalization', 'Requirió Hospitalización'),
      dataKey: REQUIRED_HOSPITALIZATION_UUID,
    },
    {
      id: 'hospitalizationTime',
      label: t('hospitalizationTime', 'Tiempo de Hospitalización'),
      dataKey: HOSPITALIZATION_TIME_UUID,
      unit: t('days', 'días'),
    },
  ];

  return (
    <PatientSummaryTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={t('birthData', 'Datos del Nacimiento')}
      dataHook={dataHook}
      rowConfig={rowConfig}
      onFormLaunch={handleLaunchForm}
    />
  );
};

export default BirthDataTable;
