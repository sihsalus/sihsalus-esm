import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import type { ProgramWorkflowState, PatientProgram, Program, ProgramsFetchResponse } from '../types';
import uniqBy from 'lodash-es/uniqBy';
import filter from 'lodash-es/filter';
import includes from 'lodash-es/includes';
import map from 'lodash-es/map';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

export const customRepresentation = `custom:(uuid,display,program,dateEnrolled,dateCompleted,location:(uuid,display),states:(startDate,endDate,voided,state:(uuid,concept:(display))))`;

type Encounter = {
  uuid: string;
  display: string;
  links: { uri: string }[];
};

type EncounterResponse = {
  results: Encounter[];
};

type Obs = {
  uuid: string;
  display: string;
  groupMembers?: Obs[];
};

type ObsEncounter = {
  encounterDatetime: string;
  form: {
    uuid: string;
    display: string;
  };
  obs: Obs[];
};

export const usePrenatalCare = (
  patientUuid: string,
): { prenatalEncounters: ObsEncounter[]; error: Error | null; isValidating: boolean; mutate: () => void } => {
  const atencionPrenatal = 'Control Prenatal';

  const attentionsUrl = useMemo(() => {
    return `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${atencionPrenatal}`;
  }, [patientUuid]);

  const { data, error, isValidating, mutate } = useSWR<EncounterResponse>(
    patientUuid ? attentionsUrl : null,
    async (url) => {
      const response = await openmrsFetch(url);
      return response?.data;
    },
  );

  const encounterUuids = useMemo(() => {
    if (!data || !data.results) return [];
    return data.results.map((encounter: Encounter) => encounter.uuid);
  }, [data]);

  const { data: detailedEncounters, error: detailedError } = useSWRImmutable(
    encounterUuids.length > 0
      ? encounterUuids.map(
          (uuid) =>
            `${restBaseUrl}/encounter/${uuid}?v=custom:(uuid,encounterDatetime,form:(uuid,display),obs:(uuid,display))`,
        )
      : null,
    async (urls) => {
      const responses = await Promise.all(urls.map((url) => openmrsFetch(url)));
      return responses.map((res) => res?.data);
    },
  );

  // Filter prenatal encounters and sort by encounterDatetime
  const filteredPrenatalEncounters = useMemo(() => {
    if (!detailedEncounters) return [];

    return detailedEncounters
      .filter((encounter) => encounter?.form?.display === 'OBST-003-ATENCIÓN PRENATAL')
      .sort((a, b) => new Date(a.encounterDatetime).getTime() - new Date(b.encounterDatetime).getTime());
  }, [detailedEncounters]);

  // Extract all observation UUIDs from all encounters
  const allObsUuids = useMemo(() => {
    if (!filteredPrenatalEncounters) return [];

    const uuids: string[] = [];
    filteredPrenatalEncounters.forEach((encounter) => {
      if (encounter.obs) {
        encounter.obs.forEach((obs) => {
          uuids.push(obs.uuid);
        });
      }
    });

    return uuids;
  }, [filteredPrenatalEncounters]);

  // Fetch group members for all observations
  const { data: obsDetails, error: obsError } = useSWRImmutable(
    allObsUuids.length > 0
      ? allObsUuids.map((uuid) => `${restBaseUrl}/obs/${uuid}?v=custom:(uuid,display,groupMembers:(uuid,display))`)
      : null,
    async (urls) => {
      const responses = await Promise.all(urls.map((url) => openmrsFetch(url)));
      return responses.map((res) => res?.data);
    },
  );

  // Combine encounters with detailed observations including group members
  const prenatalEncounters = useMemo(() => {
    if (!filteredPrenatalEncounters) return [];
    if (!obsDetails) return filteredPrenatalEncounters;

    // Create enhanced encounters with detailed observations
    return filteredPrenatalEncounters.map((encounter) => {
      // Create a deep copy of the encounter to avoid mutation issues
      const enhancedEncounter = {
        ...encounter,
        obs: [], // Initialize with empty array to rebuild with enhanced obs
      };

      // Replace each observation with its detailed version including group members
      if (encounter.obs && encounter.obs.length > 0) {
        enhancedEncounter.obs = encounter.obs.map((obs) => {
          // Find the detailed observation with group members
          const detailedObs = obsDetails.find((detail) => detail.uuid === obs.uuid);

          if (detailedObs) {
            // Return the detailed observation with group members
            return detailedObs;
          } else {
            // Return the original observation if no detailed version found
            return obs;
          }
        });
      }

      return enhancedEncounter;
    });
  }, [filteredPrenatalEncounters, obsDetails]);
  return {
    prenatalEncounters,
    error: error || detailedError || obsError,
    isValidating,
    mutate,
  };
};

/*export function useEnrollments(patientUuid: string): {
  data: PatientProgram[] | null;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  activeEnrollments: PatientProgram[] | undefined;
  mutateEnrollments: () => void;
} {
  const enrollmentsUrl = `${restBaseUrl}/programenrollment?patient=${patientUuid}&v=${customRepresentation}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: ProgramsFetchResponse }, Error>(
    patientUuid ? enrollmentsUrl : null,
    openmrsFetch,
  );

  const formattedEnrollments: PatientProgram[] | null =
    data?.data?.results.length > 0
      ? data?.data.results.sort((a, b) => (b.dateEnrolled > a.dateEnrolled ? 1 : -1))
      : null;

  const activeEnrollments = formattedEnrollments?.filter((enrollment) => !enrollment.dateCompleted);

  return {
    data: data ? uniqBy(formattedEnrollments, (program) => program?.program?.uuid) : null,
    error,
    isLoading,
    isValidating,
    activeEnrollments,
    mutateEnrollments: mutate,
  };
}

export function useAvailablePrograms(enrollments?: Array<PatientProgram>): {
  data: Program[] | null;
  error: Error | undefined;
  isLoading: boolean;
  eligiblePrograms: Program[] | undefined;
} {
  const { data, error, isLoading } = useSWR<{ data: { results: Array<Program> } }, Error>(
    `${restBaseUrl}/program?v=custom:(uuid,display,allWorkflows,concept:(uuid,display))`,
    openmrsFetch,
  );

  const availablePrograms = data?.data?.results ?? null;

  const eligiblePrograms = filter(
    availablePrograms,
    (program) => !includes(map(enrollments, 'program.uuid'), program.uuid),
  );

  return {
    data: availablePrograms,
    error,
    isLoading,
    eligiblePrograms,
  };
}

export const usePrograms = (
  patientUuid: string,
): {
  enrollments: PatientProgram[] | null;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  activeEnrollments: PatientProgram[] | undefined;
  availablePrograms: Program[] | null;
  eligiblePrograms: Program[] | undefined;
} => {
  const {
    data: enrollments,
    error: enrollError,
    isLoading: enrolLoading,
    isValidating,
    activeEnrollments,
  } = useEnrollments(patientUuid);
  const { data: availablePrograms, eligiblePrograms } = useAvailablePrograms(enrollments);

  const status = { isLoading: enrolLoading, error: enrollError };
  return {
    enrollments,
    ...status,
    isValidating,
    activeEnrollments,
    availablePrograms,
    eligiblePrograms,
  };
};

export const findLastState = (states: ProgramWorkflowState[]): ProgramWorkflowState => {
  const activeStates = states.filter((state) => !state.voided);
  const ongoingState = activeStates.find((state) => !state.endDate);

  if (ongoingState) {
    return ongoingState;
  }

  return activeStates.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];
};
*/
