import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { baseUrl } from '../constants';

const API_URL = `${baseUrl}/infrastructure`;

export interface Infrastructure {
  id: number;
  uuid: string;
  locationName: string;
  areaM2: number;
  constructionCost: number;
}

const useGetInfrastructure = () => {
  const { data, error, isLoading, mutate } = useSWR<{ data: Infrastructure[] }>(API_URL, openmrsFetch);
  return {
    infrastructure: data?.data ?? [],
    isError: error,
    isLoading,
    mutate,
  };
};
export default useGetInfrastructure;
