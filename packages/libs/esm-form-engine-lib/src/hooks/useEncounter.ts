import { useEffect, useState } from 'react';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type FormSchema, type OpenmrsEncounter } from '../types';
import { encounterRepresentation } from '../constants';
import { isEmpty } from '../validators/form-validator';
import isString from 'lodash-es/isString';

export function useEncounter(formJson: FormSchema): {
  encounter: OpenmrsEncounter | null;
  error: Error | null;
  isLoading: boolean;
} {
  const [encounter, setEncounter] = useState<OpenmrsEncounter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let disposed = false;

    if (!isEmpty(formJson.encounter) && isString(formJson.encounter)) {
      void openmrsFetch<OpenmrsEncounter>(
        `${restBaseUrl}/encounter/${formJson.encounter}?v=${encounterRepresentation}`,
        {
          signal: abortController.signal,
        },
      )
        .then((response) => {
          if (!disposed) {
            setEncounter(response.data);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          if (!disposed) {
            setError(error instanceof Error ? error : new Error('Failed to load encounter'));
            setIsLoading(false);
          }
        });
    } else if (!isEmpty(formJson.encounter)) {
      setEncounter(formJson.encounter as OpenmrsEncounter);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    return (): void => {
      disposed = true;
      abortController.abort();
    };
  }, [formJson.encounter]);

  return { encounter, error, isLoading };
}
