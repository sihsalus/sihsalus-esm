import { launchWorkspace2, useConfig } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ConfigObject } from '../../../config-schema'; // Ajusta la ruta
import { useLatestValidEncounter } from '../../../hooks/useLatestEncounter'; // Ajusta la ruta
import PatientSummaryTable from '../../../ui/patient-summary-table/patient-summary-table.component'; // Ajusta la ruta
import {
  SKIN_COLOR_UUID,
  FONTANELLE_UUID,
  SUTURES_UUID,
  EARS_UUID,
  NOSE_UUID,
  MOUTH_UUID,
  NECK_UUID,
  THORAX_UUID,
  NIPPLES_UUID,
  CLAVICLE_UUID,
  ESOPHAGUS_PERMEABILITY_UUID,
  UMBILICAL_CORD_UUID,
  ABDOMEN_CHARACTERISTICS_UUID,
  GENITOURINARY_UUID,
  OBSERVATION_UUID,
  GENITOURINARY_ELIMINATION_UUID,
  SPINAL_COLUMN_UUID,
  LIMBS_UUID,
  MUSCLE_TONE_UUID,
  HIP_UUID,
  NEUROLOGICAL_EVALUATION_UUID,
} from '../../concepts/neonatal-concepts';

interface CephaloCaudalNeurologicalEvaluationProps {
  patientUuid: string;
}

const CephaloCaudalNeurologicalEvaluationTable: React.FC<CephaloCaudalNeurologicalEvaluationProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t(
    'cephaloCaudalNeurologicalEvaluation',
    'Cephalo-caudal and neurological evaluation',
  );
  const { encounter, isLoading, error, mutate } = useLatestValidEncounter(
    patientUuid,
    config.encounterTypes.cefaloCaudal,
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
      form: { uuid: config.formsList.newbornNeuroEval },
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
    { id: 'skinColor', label: t('skinColor', 'Color de Piel'), dataKey: SKIN_COLOR_UUID },
    { id: 'fontanelle', label: t('fontanelle', 'Fontanela'), dataKey: FONTANELLE_UUID },
    { id: 'sutures', label: t('sutures', 'Suturas'), dataKey: SUTURES_UUID },
    { id: 'ears', label: t('ears', 'Orejas'), dataKey: EARS_UUID },
    { id: 'nose', label: t('nose', 'Nariz'), dataKey: NOSE_UUID },
    { id: 'mouth', label: t('mouth', 'Boca'), dataKey: MOUTH_UUID },
    { id: 'neck', label: t('neck', 'Cuello'), dataKey: NECK_UUID },
    { id: 'thorax', label: t('thorax', 'Tórax'), dataKey: THORAX_UUID },
    { id: 'nipples', label: t('nipples', 'Mamilas'), dataKey: NIPPLES_UUID },
    { id: 'clavicle', label: t('clavicle', 'Clavícula'), dataKey: CLAVICLE_UUID },
    {
      id: 'esophagus',
      label: t('esophagus', 'Permeabilidad Esófago'),
      dataKey: ESOPHAGUS_PERMEABILITY_UUID,
    },
    {
      id: 'umbilicalCord',
      label: t('umbilicalCord', 'Cordón Umbilical'),
      dataKey: UMBILICAL_CORD_UUID,
    },
    {
      id: 'abdomenCharacteristics',
      label: t('abdomenCharacteristics', 'Características del Abdomen'),
      dataKey: ABDOMEN_CHARACTERISTICS_UUID,
    },
    {
      id: 'genitourinary',
      label: t('genitourinary', 'Genito Urinario'),
      dataKey: GENITOURINARY_UUID,
    },
    { id: 'observation', label: t('observation', 'Observación'), dataKey: OBSERVATION_UUID },
    {
      id: 'analPermeability',
      label: t('analPermeability', 'Permeabilidad Anal'),
      dataKey: ESOPHAGUS_PERMEABILITY_UUID,
    },
    {
      id: 'genitourinaryElimination',
      label: t('genitourinaryElimination', 'Eliminación Genito Urinario'),
      dataKey: GENITOURINARY_ELIMINATION_UUID,
    },
    {
      id: 'spinalColumn',
      label: t('spinalColumn', 'Columna Vertebral'),
      dataKey: SPINAL_COLUMN_UUID,
    },
    { id: 'limbs', label: t('limbs', 'Extremidades'), dataKey: LIMBS_UUID },
    { id: 'muscleTone', label: t('muscleTone', 'Tono Muscular'), dataKey: MUSCLE_TONE_UUID },
    { id: 'hip', label: t('hip', 'Cadera'), dataKey: HIP_UUID },
    {
      id: 'neurologicalEvaluation',
      label: t('neurologicalEvaluation', 'Valoración Neurológica'),
      dataKey: NEUROLOGICAL_EVALUATION_UUID,
    },
  ];

  return (
    <PatientSummaryTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={t('cephaloCaudalNeurologicalEvaluation', 'Cephalo-caudal and neurological evaluation')}
      dataHook={dataHook}
      rowConfig={rowConfig}
      onFormLaunch={handleLaunchForm}
    />
  );
};

export default CephaloCaudalNeurologicalEvaluationTable;
