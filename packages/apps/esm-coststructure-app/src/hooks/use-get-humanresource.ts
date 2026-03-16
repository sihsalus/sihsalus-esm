import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { baseUrl } from '../constants';

const API_URL = `${baseUrl}/humanresource`;

export interface HumanResource {
  id: number;
  uuid: string;
  speciality: string;
}

const useGetHumanResource = () => {
  const { data, error, isLoading, mutate } = useSWR<{ data: HumanResource[] }>(API_URL, openmrsFetch);
  return {
    humanresource: data?.data ?? [],
    isError: error,
    isLoading,
    mutate,
  };
};
export default useGetHumanResource;
