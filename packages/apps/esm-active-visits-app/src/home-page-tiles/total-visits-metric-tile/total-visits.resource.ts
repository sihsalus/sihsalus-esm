import { openmrsFetch, restBaseUrl, type Visit } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import useSWR from 'swr';

const useTotalVisits = () => {
  const customRepresentation = 'custom:(uuid,startDatetime,stopDatetime)';

  const visitsUrl = `${restBaseUrl}/visit?includeInactive=true&v=${customRepresentation}&fromStartDate=${dayjs().format(
    'YYYY-MM-DD',
  )}`;

  const { data, error, isLoading } = useSWR<{ data: { results: Array<Visit> } }>(visitsUrl, openmrsFetch);

  return {
    data: data?.data?.results,
    error,
    isLoading,
  };
};

export default useTotalVisits;
