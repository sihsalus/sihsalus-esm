import { openmrsFetch, restBaseUrl, useSession } from '@openmrs/esm-framework';
import useSWR from 'swr';

export default function useActiveVisits() {
  const session = useSession();
  const sessionLocation = session?.sessionLocation?.uuid;

  const customRepresentation = 'custom:(uuid,startDatetime,stopDatetime)';

  const getUrl = () => {
    const url = `${restBaseUrl}/visit?v=${customRepresentation}&`;
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.append('includeParentLocations', 'true');
    urlSearchParams.append('includeInactive', 'false');
    urlSearchParams.append('totalCount', 'true');
    urlSearchParams.append('location', `${sessionLocation}`);

    return url + urlSearchParams.toString();
  };

  const { data, error, isLoading } = useSWR<{ data: { totalCount: number } }>(getUrl, openmrsFetch);

  return {
    count: data?.data?.totalCount,
    error,
    isLoading,
  };
}
