import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig, launchWorkspace2 } from '@openmrs/esm-framework';
import { useLatestValidEncounter } from '../../../../hooks/useLatestEncounter'; // Ajusta la ruta
import PatientSummaryTable from '../../../../ui/patient-summary-table/patient-summary-table.component'; // Ajusta la ruta
import type { ConfigObject } from '../../../../config-schema'; // Ajusta la ruta
import {
  PREGNANCY_NUMBER_UUID,
  PRENATAL_CARE_NUMBER_UUID,
  PRENATAL_CARE_LOCATION_UUID,
  DELIVERY_CONDITION_UUID,
  DELIVERY_LOCATION_UUID,
  DELIVERY_ATTENDANT_UUID,
} from '../../../concepts/neonatal-concepts';

interface PregnancyBirthProps {
  patientUuid: string;
}

const PregnancyBirthTable: React.FC<PregnancyBirthProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('pregnancyBirth', 'Pregnancy and birth');
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
      form: { uuid: config.formsList.pregnancyDetails },
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
    // SECCIÓN EMBARAZO
    {
      id: 'pregnancyNumber',
      label: t('pregnancyNumber', 'Nº de Embarazo (Gravida)'),
      dataKey: PREGNANCY_NUMBER_UUID,
      sectionTitle: t('pregnancy', 'EMBARAZO'),
    },
    {
      id: 'prenatalCareNumber',
      label: t('prenatalCareNumber', 'Nº de Atenciones Prenatales'),
      dataKey: PRENATAL_CARE_NUMBER_UUID,
    },
    {
      id: 'prenatalCareLocation',
      label: t('prenatalCareLocation', 'Lugar de Atenciones Prenatales'),
      dataKey: PRENATAL_CARE_LOCATION_UUID,
    },

    // SECCIÓN PARTO
    {
      id: 'deliveryType',
      label: t('birthCondition', 'Birth condition'),
      dataKey: DELIVERY_CONDITION_UUID,
      sectionTitle: t('delivery', 'PARTO'),
    },
    {
      id: 'deliveryLocation',
      label: t('deliveryLocation', 'Lugar del Parto'),
      dataKey: DELIVERY_LOCATION_UUID,
    },
    {
      id: 'deliveryAttendant',
      label: t('deliveryAttendant', 'Atendido Por'),
      dataKey: DELIVERY_ATTENDANT_UUID,
    },
  ];

  return (
    <PatientSummaryTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={t('pregnancyBirth', 'Pregnancy and birth')}
      dataHook={dataHook}
      rowConfig={rowConfig}
      onFormLaunch={handleLaunchForm}
    />
  );
};

export default PregnancyBirthTable;
