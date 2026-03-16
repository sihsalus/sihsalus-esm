import { useState, useEffect } from 'react';
import { openmrsFetch } from '@openmrs/esm-framework';

// Type (aligned with VaccinationSchedule)
interface AgeRange {
  id: string;
  name: string;
  months: number;
}

// Mock data (for simulation when API isn't available)
const MOCK_AGE_RANGES: AgeRange[] = [
  { id: 'rn', name: 'R.N.', months: 0 },
  { id: '2m', name: '2 meses', months: 2 },
  { id: '4m', name: '4 meses', months: 4 },
  { id: '6m', name: '6 meses', months: 6 },
  { id: '12m', name: '12 meses', months: 12 },
  { id: '18m', name: '18 meses', months: 18 },
];

// Hook implementation
export const useAgeRanges = () => {
  const [data, setData] = useState<AgeRange[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchAgeRanges = async () => {
      setIsLoading(true);
      try {
        const response = await openmrsFetch('/ws/rest/v1/age-ranges', {
          method: 'GET',
          signal: abortController.signal,
        });

        const mockResponse = MOCK_AGE_RANGES;
        const result = response.data?.ageRanges || mockResponse;

        if (Array.isArray(result) && result.every((item: Record<string, unknown>) => 'id' in item && 'name' in item && 'months' in item)) {
          setData(result as AgeRange[]);
        } else {
          throw new Error('Invalid age ranges data');
        }
      } catch (err) {
        if (abortController.signal.aborted) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch age ranges'));
        setData(MOCK_AGE_RANGES);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchAgeRanges();

    return () => abortController.abort();
  }, [shouldRefetch]);

  // Mutate function to trigger refetch (e.g., if age ranges are updated)
  const mutate = () => {
    setShouldRefetch((prev) => !prev);
  };

  return { data, isLoading, error, mutate };
};
