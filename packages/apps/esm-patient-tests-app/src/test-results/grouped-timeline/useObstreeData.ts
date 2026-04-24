import { type FetchResponse, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { usePatientChartStore } from '@openmrs/esm-patient-common-lib';
import { useMemo } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

import { type ObservationData, type TreeNode } from '../filter/filter-types';
import { assessValue, exist } from '../loadPatientTestData/helpers';

export const getName = (prefix: string | undefined, name: string) => {
  return prefix ? `${prefix}-${name}` : name;
};

interface ObsTreeNode extends Omit<TreeNode, 'subSets' | 'obs'> {
  flatName: string;
  display: string;
  hasData: boolean;
  subSets: Array<ObsTreeNode>;
  obs: Array<ObservationData>;
}

const emptyObsTree: ObsTreeNode = {
  display: '',
  flatName: '',
  hasData: false,
  subSets: [],
  obs: [],
};

const augmentObstreeData = (node: ObsTreeNode, prefix: string | undefined): ObsTreeNode => {
  const outData: ObsTreeNode = JSON.parse(JSON.stringify(node));
  outData.flatName = getName(prefix, node.display);
  outData.hasData = false;

  if (outData?.subSets?.length) {
    outData.subSets = outData.subSets.map((subNode: ObsTreeNode) =>
      augmentObstreeData(subNode, getName(prefix, node?.display)),
    );
    outData.hasData = outData.subSets.some((subNode: ObsTreeNode) => subNode.hasData);
  }
  if (exist(outData?.hiNormal, outData?.lowNormal)) {
    outData.range = `${outData.lowNormal} – ${outData.hiNormal}`;
  }
  if (outData?.obs?.length) {
    const assess = assessValue(outData);
    outData.obs = outData.obs.map((ob) => ({ ...ob, interpretation: assess(ob.value) }));
    outData.hasData = true;
  }

  return outData;
};

const useGetObstreeData = (conceptUuid: string) => {
  const { patientUuid } = usePatientChartStore();
  const response = useSWR<FetchResponse<ObsTreeNode>, Error>(
    `${restBaseUrl}/obstree?patient=${patientUuid}&concept=${conceptUuid}`,
    openmrsFetch,
  );
  const result = useMemo(() => {
    if (response.data) {
      const { data, ...rest } = response;
      const newData = augmentObstreeData(data?.data ?? emptyObsTree, '');
      return { ...rest, loading: false, data: newData };
    } else {
      return {
        data: emptyObsTree,
        error: false,
        loading: true,
      };
    }
  }, [response]);
  return result;
};

const useGetManyObstreeData = (uuidArray: Array<string>) => {
  const { patientUuid } = usePatientChartStore();
  const getObstreeUrl = (index: number) => {
    if (index < uuidArray.length && patientUuid) {
      return `${restBaseUrl}/obstree?patient=${patientUuid}&concept=${uuidArray[index]}`;
    } else return null;
  };
  const { data, error } = useSWRInfinite(getObstreeUrl, openmrsFetch, {
    initialSize: uuidArray.length,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const result = useMemo(() => {
    return (
      data?.map((resp) => {
        if (resp?.data) {
          const { data, ...rest } = resp;
          const newData = augmentObstreeData(data ?? emptyObsTree, '');
          return { ...rest, loading: false, data: newData };
        } else {
          return {
            data: emptyObsTree,
            error: false,
            loading: true,
          };
        }
      }) || [
        {
          data: emptyObsTree,
          error: false,
          loading: true,
        },
      ]
    );
  }, [data]);
  const roots = result.map((item) => item.data);
  const isLoading = result.some((item) => item.loading);

  return { roots, isLoading, error };
};

export default useGetManyObstreeData;
export { useGetManyObstreeData, useGetObstreeData };
