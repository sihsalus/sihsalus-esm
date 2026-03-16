import { useState, useEffect, useCallback } from 'react';
import { openmrsFetch } from '@openmrs/esm-framework';

// Types (aligned with VaccinationSchedule)
interface VaccinationData {
  status: 'pending' | 'completed' | 'overdue' | 'scheduled' | 'not-applicable';
  date: string;
}

interface Vaccine {
  id: string;
  name: string;
}

interface VaccinationSchema {
  vaccines: Vaccine[];
  schema: Record<string, Record<string, VaccinationData>>;
}

// Mock data (for simulation when API isn't available)
const MOCK_VACCINES: Vaccine[] = [
  { id: 'hib', name: 'HiB RN' },
  { id: 'bcg', name: 'BCG' },
  { id: 'pentavalent', name: 'Pentavalente (DPT, HB, Hib)' },
  { id: 'polio', name: 'Polio' },
  { id: 'rotavirus', name: 'Rotavirus' },
  { id: 'neumo', name: 'Neumococo' },
  { id: 'influenza_p', name: 'Influenza pediátrica' },
  { id: 'srp', name: 'SPR' },
  { id: 'varicela', name: 'Varicela' },
];

const MOCK_SCHEMA: Record<string, Record<string, VaccinationData>> = {
  hib: { rn: { status: 'pending', date: '' } },
  bcg: { rn: { status: 'pending', date: '' } },
  pentavalent: {
    '2m': { status: 'pending', date: '' },
    '4m': { status: 'pending', date: '' },
    '6m': { status: 'pending', date: '' },
  },
  polio: {
    '2m': { status: 'pending', date: '' },
    '4m': { status: 'pending', date: '' },
    '6m': { status: 'pending', date: '' },
  },
  rotavirus: {
    '2m': { status: 'pending', date: '' },
    '4m': { status: 'pending', date: '' },
  },
  neumo: {
    '2m': { status: 'pending', date: '' },
    '4m': { status: 'pending', date: '' },
    '12m': { status: 'pending', date: '' },
  },
  influenza_p: {
    '6m': { status: 'pending', date: '' },
    '12m': { status: 'pending', date: '' },
  },
  srp: { '12m': { status: 'pending', date: '' } },
  varicela: { '12m': { status: 'pending', date: '' } },
};

// Hook implementation
export const useVaccinationSchema = () => {
  const [data, setData] = useState<VaccinationSchema>({
    vaccines: [],
    schema: {},
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchVaccinationSchema = async () => {
      setIsLoading(true);
      try {
        const response = await openmrsFetch('/ws/rest/v1/vaccination-schema', {
          method: 'GET',
          signal: abortController.signal,
        });

        const mockResponse = {
          vaccines: MOCK_VACCINES,
          schema: MOCK_SCHEMA,
        };
        const result = response.data || mockResponse;

        if (result.vaccines && result.schema) {
          setData({
            vaccines: result.vaccines,
            schema: result.schema,
          });
        } else {
          throw new Error('Invalid vaccination schema data');
        }
      } catch (err) {
        if (abortController.signal.aborted) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch vaccination schema'));
        setData({
          vaccines: MOCK_VACCINES,
          schema: MOCK_SCHEMA,
        });
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchVaccinationSchema();

    return () => abortController.abort();
  }, [shouldRefetch]);

  // Mutate function to trigger refetch (e.g., after adding a vaccination)
  const mutate = useCallback(() => {
    setShouldRefetch((prev) => !prev);
  }, []);

  return { data, isLoading, error, mutate };
};
