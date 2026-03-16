import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { baseUrl } from '../constants';

const API_URL = `${baseUrl}/equipment`;

export interface Equipment {
  id: number;
  uuid: string;
  name: string;
  usefulLifeYears: number;
}

const useGetEquipment = () => {
  const { data, error, isLoading, mutate } = useSWR<{ data: Equipment[] }>(API_URL, openmrsFetch);
  return {
    equipments: data?.data ?? [],
    isError: error,
    isLoading,
    mutate,
  };
};
export default useGetEquipment;
