import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';

import { baseUrl } from '../constants';
import { type CostStructure, type Procedure } from '../types';

const API_URL = `${baseUrl}/list`;

interface Response {
  content: CostStructureResponse[];
  total: number;
  page: number;
  size: number;
}

interface CostStructureResponse extends CostStructure {
  procedure: Procedure | null;
}
const useGetCostStructure = (page = 0, size = 10, query = '') => {
  const params = new URLSearchParams({ page: String(page), size: String(size), query });
  const URL = `${API_URL}?${params.toString()}`;
  const { data, error, isLoading, mutate } = useSWR<{ data: Response }>(URL, openmrsFetch);

  return {
    costStructure: data?.data?.content ?? [],
    total: data?.data?.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
};
export default useGetCostStructure;
