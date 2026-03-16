import { launchWorkspace2, useConfig } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ConfigObject } from '../../../config-schema';
import { useLatestValidEncounter } from '../../../hooks/useLatestEncounter';
import PatientSummaryTable from '../../../ui/patient-summary-table/patient-summary-table.component';
import {
  ADMISSION_DATE_TIME_UUID,
  GESTATIONAL_AGE_UUID,
  HEMATOCRIT_UUID,
  MOTHER_AGE_UUID,
  NUMBER_OF_CHILDREN_UUID,
  DELIVERY_TYPE_AC_UUID,
  NIPPLES_AC_UUID,
  MILK_PRODUCTION_UUID,
  LATCH_UUID,
  SUCTION_AC_UUID,
  SWALLOWING_UUID,
  NURSING_DIAGNOSIS_AC_UUID,
  NURSING_INTERVENTION_UUID,
} from '../../concepts/neonatal-concepts';

interface AlojamientoConjuntoProps {
  patientUuid: string;
}

const AlojamientoConjunto: React.FC<AlojamientoConjuntoProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('alojamientoConjunto', 'Alojamiento Conjunto');
  const { encounter, isLoading, error, mutate } = useLatestValidEncounter(
    patientUuid,
    config.encounterTypes.alojamientoConjunto,
  );

  const obsData = React.useMemo(() => {
    if (!encounter?.obs) return {};
    return encounter.obs.reduce((acc, obs) => {
      if (obs?.concept?.uuid && obs.value !== undefined) {
        acc[obs.concept.uuid] = obs.value;
      }
      return acc;
    }, {});
  }, [encounter]);

  const handleLaunchForm = React.useCallback(() => {
    if (!config.formsList?.roomingIn) {
      console.error('Form UUID not configured for roomingIn');
      return;
    }

    try {
      launchWorkspace2('patient-form-entry-workspace', {
        form: { uuid: config.formsList.roomingIn },
        encounterUuid: encounter?.uuid || '',
      });
    } catch (error) {
      console.error('Error launching workspace:', error);
    }
  }, [config.formsList.roomingIn, encounter?.uuid]);

  const dataHook = React.useCallback(() => {
    return {
      data: encounter ? [obsData] : [],
      isLoading,
      error,
      mutate,
    };
  }, [encounter, obsData, isLoading, error, mutate]);

  if (!patientUuid || typeof patientUuid !== 'string') {
    return <div>Error: UUID de paciente inválido</div>;
  }

  const rowConfig = [
    // Datos Generales
    {
      id: 'fechaYHoraDeIngreso',
      label: t('fechaYHoraDeIngreso', 'Fecha y hora de ingreso'),
      dataKey: ADMISSION_DATE_TIME_UUID,
    },
    {
      id: 'edadGestacional',
      label: t('edadGestacional', 'Edad Gestacional (semanas)'),
      dataKey: GESTATIONAL_AGE_UUID,
    },
    {
      id: 'hematocrito',
      label: t('hematocrito', 'Hematocrito (%)'),
      dataKey: HEMATOCRIT_UUID,
    },

    // Valoración de enfermería al ingreso - En la madre
    {
      id: 'edadDeLaMadre',
      label: t('edadDeLaMadre', 'Edad de la madre'),
      dataKey: MOTHER_AGE_UUID,
    },
    {
      id: 'numeroDeHijos',
      label: t('numeroDeHijos', 'Número de hijos'),
      dataKey: NUMBER_OF_CHILDREN_UUID,
    },
    {
      id: 'tipoDeParto',
      label: t('tipoDeParto', 'Tipo de parto'),
      dataKey: DELIVERY_TYPE_AC_UUID,
    },
    {
      id: 'pezones',
      label: t('pezones', 'Pezones'),
      dataKey: NIPPLES_AC_UUID,
    },
    {
      id: 'produccionLactea',
      label: t('produccionLactea', 'Producción Láctea'),
      dataKey: MILK_PRODUCTION_UUID,
    },

    // Valoración de enfermería al ingreso - En el recién nacido
    {
      id: 'agarre',
      label: t('agarre', 'Agarre'),
      dataKey: LATCH_UUID,
    },
    {
      id: 'succion',
      label: t('succion', 'Succión'),
      dataKey: SUCTION_AC_UUID,
    },
    {
      id: 'deglucion',
      label: t('deglucion', 'Deglución'),
      dataKey: SWALLOWING_UUID,
    },
    {
      id: 'diagnosticoDeEnfermeria',
      label: t('diagnosticoDeEnfermeria', 'Diagnóstico de Enfermería'),
      dataKey: NURSING_DIAGNOSIS_AC_UUID,
    },
    {
      id: 'intervencionDeEnfermeria',
      label: t('intervencionDeEnfermeria', 'Intervención de enfermería'),
      dataKey: NURSING_INTERVENTION_UUID,
    },
  ];

  return (
    <PatientSummaryTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={t('alojamientoConjunto', 'Alojamiento Conjunto')}
      dataHook={dataHook}
      rowConfig={rowConfig}
      onFormLaunch={handleLaunchForm}
    />
  );
};

export default AlojamientoConjunto;
