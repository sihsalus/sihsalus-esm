import { openmrsFetch, useConfig } from '@openmrs/esm-framework';
import { useState } from 'react';

import useOdontogramDataStore from '../store/odontogramDataStore';
import type { OdontogramConfig } from '../config-schema';

interface SaveOdontogramParams {
  patientUuid: string;
  encounterUuid?: string;
}

export function useOdontogramEncounter() {
  const config = useConfig<OdontogramConfig>();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = async ({ patientUuid, encounterUuid }: SaveOdontogramParams) => {
    setIsSaving(true);
    setError(null);

    try {
      const data = useOdontogramDataStore.getState().data;

      const obs = data.teeth
        .filter((tooth) => tooth.findings.length > 0)
        .flatMap((tooth) =>
          tooth.findings.map((finding) => ({
            concept: config.findingConceptUuid,
            value: String(tooth.toothId),
            comment: JSON.stringify({
              optionId: finding.findingId,
              subOptionId: finding.subOptionId,
              color: finding.color,
              dynamicDesign: finding.designNumber ?? null,
            }),
          })),
        );

      const payload = {
        patient: patientUuid,
        encounterType: config.encounterTypeUuid,
        obs,
        ...(encounterUuid ? { uuid: encounterUuid } : {}),
      };

      const response = await openmrsFetch('/ws/rest/v1/encounter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Failed to save odontogram: ${response.status}`);
      }

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
