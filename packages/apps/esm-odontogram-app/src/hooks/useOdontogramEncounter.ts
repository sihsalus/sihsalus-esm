import { useConfig } from '@openmrs/esm-framework';
import { useState } from 'react';

import type { OdontogramConfig } from '../config-schema';
import { saveEncounter, updateEncounter } from '../odontogram.resource';
import useOdontogramDataStore from '../store/odontogramDataStore';

interface SaveOdontogramParams {
  patientUuid: string;
  encounterUuid?: string;
}

export function useOdontogramEncounter() {
  const config = useConfig<OdontogramConfig>();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getConceptUuidForFinding = (findingId: number): string => {
    const mappedConcept = config.findingConceptUuids?.[String(findingId)]?.trim();
    if (mappedConcept) {
      return mappedConcept;
    }

    const fallbackConcept = config.findingConceptUuid?.trim();
    if (fallbackConcept) {
      return fallbackConcept;
    }

    throw new Error(
      `Missing odontogram concept mapping for finding ${findingId}. Configure findingConceptUuid or findingConceptUuids.`,
    );
  };

  const save = async ({ patientUuid, encounterUuid }: SaveOdontogramParams) => {
    setIsSaving(true);
    setError(null);

    try {
      const { workspaceMode } = useOdontogramDataStore.getState();

      const encounterTypeUuid =
        workspaceMode === 'base'
          ? config.baseEncounterTypeUuid?.trim()
          : config.attentionEncounterTypeUuid?.trim();

      if (!encounterTypeUuid) {
        throw new Error(
          workspaceMode === 'base'
            ? 'Missing required config: baseEncounterTypeUuid'
            : 'Missing required config: attentionEncounterTypeUuid',
        );
      }

      const { getAllFindings } = useOdontogramDataStore.getState();
      const allFindings = getAllFindings();

      const obs = allFindings.map((finding) => ({
        concept: getConceptUuidForFinding(finding.findingId),
        value:
          finding.source === 'tooth'
            ? String(finding.toothId)
            : `${finding.leftToothId ?? ''}-${finding.rightToothId ?? ''}`,
        comment: JSON.stringify({
          source: finding.source,
          findingId: finding.findingId,
          toothId: finding.toothId ?? null,
          leftToothId: finding.leftToothId ?? null,
          rightToothId: finding.rightToothId ?? null,
          subOptionId: finding.subOptionId ?? null,
          color: finding.colorName ? { id: finding.colorId, name: finding.colorName } : null,
          dynamicDesign: finding.designNumber ?? null,
        }),
      }));

      const payload = { patient: patientUuid, encounterType: encounterTypeUuid, obs };
      const response = encounterUuid
        ? await updateEncounter(encounterUuid, payload)
        : await saveEncounter(payload);

      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving, error };
}
