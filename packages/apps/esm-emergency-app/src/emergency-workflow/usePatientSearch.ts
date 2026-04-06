/**
 * Custom hook for patient search with infinite scroll
 * Based on OpenMRS patient search patterns
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import { openmrsFetch, restBaseUrl, type FetchResponse } from '@openmrs/esm-framework';
import type { SearchedPatient } from './types';

// Development mode flag - set to true to use hardcoded data without backend
const USE_HARDCODED_DATA = false;

// Hardcoded patients for development/testing (simula respuesta del backend)
const HARDCODED_PATIENTS: SearchedPatient[] = [
  {
    uuid: 'patient-001-hardcoded',
    display: 'Juan Pérez García',
    identifiers: [
      {
        uuid: 'id-001',
        identifier: '12345678',
        identifierType: {
          uuid: 'dni-type-uuid',
          display: 'DNI',
        },
      },
      {
        uuid: 'id-002',
        identifier: 'OP-2024-001',
        identifierType: {
          uuid: 'openmrs-id-type',
          display: 'OpenMRS ID',
        },
      },
    ],
    person: {
      age: 34,
      gender: 'M',
      birthdate: '1990-01-15',
      birthdateEstimated: false,
      display: 'Juan Pérez García',
      personName: {
        givenName: 'Juan',
        familyName: 'Pérez García',
        display: 'Juan Pérez García',
      },
    },
  },
  {
    uuid: 'patient-002-hardcoded',
    display: 'María López Rodríguez',
    identifiers: [
      {
        uuid: 'id-003',
        identifier: '87654321',
        identifierType: {
          uuid: 'dni-type-uuid',
          display: 'DNI',
        },
      },
    ],
    person: {
      age: 28,
      gender: 'F',
      birthdate: '1996-05-20',
      birthdateEstimated: false,
      display: 'María López Rodríguez',
      personName: {
        givenName: 'María',
        familyName: 'López Rodríguez',
        display: 'María López Rodríguez',
      },
    },
  },
  {
    uuid: 'patient-003-hardcoded',
    display: 'Pedro González Méndez',
    identifiers: [
      {
        uuid: 'id-004',
        identifier: '11223344',
        identifierType: {
          uuid: 'dni-type-uuid',
          display: 'DNI',
        },
      },
    ],
    person: {
      age: 45,
      gender: 'M',
      birthdate: '1979-08-10',
      birthdateEstimated: false,
      display: 'Pedro González Méndez',
      personName: {
        givenName: 'Pedro',
        familyName: 'González Méndez',
        display: 'Pedro González Méndez',
      },
    },
  },
  {
    uuid: 'patient-004-hardcoded',
    display: 'Ana Martínez Torres',
    identifiers: [
      {
        uuid: 'id-005',
        identifier: '55667788',
        identifierType: {
          uuid: 'dni-type-uuid',
          display: 'DNI',
        },
      },
    ],
    person: {
      age: 52,
      gender: 'F',
      birthdate: '1972-11-25',
      birthdateEstimated: false,
      display: 'Ana Martínez Torres',
      personName: {
        givenName: 'Ana',
        familyName: 'Martínez Torres',
        display: 'Ana Martínez Torres',
      },
    },
  },
];

type InfinitePatientSearchResponse = FetchResponse<{
  results: Array<SearchedPatient>;
  links: Array<{ rel: 'prev' | 'next' }>;
  totalCount: number;
}>;

export interface PatientSearchResponse {
  data: SearchedPatient[] | null;
  isLoading: boolean;
  fetchError: Error | undefined;
  hasMore: boolean;
  isValidating: boolean;
  setPage: (size: number | ((size: number) => number)) => Promise<any>;
  currentPage: number;
  totalResults: number;
}

// Patient properties to fetch from API
const patientProperties = [
  'patientId',
  'uuid',
  'identifiers',
  'display',
  'patientIdentifier:(uuid,identifier)',
  'person:(gender,age,birthdate,birthdateEstimated,personName,addresses,display,dead,deathDate)',
  'attributes:(value,attributeType:(uuid,display))',
];

const patientSearchCustomRepresentation = `custom:(${patientProperties.join(',')})`;

/**
 * Hook for searching patients with infinite scroll capability
 * 
 * @param searchQuery - The search term (name, ID, or DNI)
 * @param includeDead - Whether to include deceased patients
 * @param isSearching - Whether search is active
 * @param resultsToFetch - Number of results per page
 * @returns Patient search response with pagination
 */
export function usePatientSearch(
  searchQuery: string,
  includeDead: boolean = false,
  isSearching: boolean = true,
  resultsToFetch: number = 10,
): PatientSearchResponse {
  // HARDCODED DATA MODE (for development)
  const [hardcodedData, setHardcodedData] = useState<SearchedPatient[] | null>(null);
  const [hardcodedIsLoading, setHardcodedIsLoading] = useState(false);

  useEffect(() => {
    if (!USE_HARDCODED_DATA) return;

    const shouldSearch = isSearching && searchQuery && searchQuery.length >= 2;

    if (shouldSearch) {
      setHardcodedIsLoading(true);

      // Simulate API delay
      const timer = setTimeout(() => {
        const query = searchQuery.toLowerCase().trim();

        // Filter patients based on search query
        const filtered = HARDCODED_PATIENTS.filter((patient) => {
          const fullName = patient.display.toLowerCase();
          const identifiers = patient.identifiers.map((id) => id.identifier.toLowerCase());

          return (
            fullName.includes(query) ||
            identifiers.some((id) => id.includes(query)) ||
            patient.person.personName.givenName.toLowerCase().includes(query) ||
            patient.person.personName.familyName.toLowerCase().includes(query)
          );
        });

        setHardcodedData(filtered);
        setHardcodedIsLoading(false);
      }, 500); // Simulate network delay

      return () => clearTimeout(timer);
    } else {
      setHardcodedData(null);
      setHardcodedIsLoading(false);
    }
  }, [searchQuery, isSearching]);

  // REAL BACKEND MODE (when backend is available)
  const getUrl = useCallback(
    (
      page: number,
      prevPageData: FetchResponse<{ results: Array<SearchedPatient>; links: Array<{ rel: 'prev' | 'next' }> }>,
    ) => {
      if (prevPageData && !prevPageData?.data?.links.some((link) => link.rel === 'next')) {
        return null;
      }

      const baseUrl = `${restBaseUrl}/patient`;
      const params = new URLSearchParams({
        q: searchQuery,
        v: patientSearchCustomRepresentation,
        includeDead: includeDead.toString(),
        limit: resultsToFetch.toString(),
        totalCount: 'true',
        ...(page ? { startIndex: (page * resultsToFetch).toString() } : {}),
      });

      return `${baseUrl}?${params.toString()}`;
    },
    [searchQuery, includeDead, resultsToFetch],
  );

  const shouldFetch = !USE_HARDCODED_DATA && isSearching && searchQuery && searchQuery.length >= 2;

  const { data, isLoading, isValidating, setSize, error, size } = useSWRInfinite<InfinitePatientSearchResponse, Error>(
    shouldFetch ? getUrl : null,
    openmrsFetch,
  );

  const mappedData = USE_HARDCODED_DATA ? hardcodedData : data?.flatMap((res) => res.data?.results ?? []) ?? null;

  return useMemo(
    () => ({
      data: mappedData,
      isLoading: USE_HARDCODED_DATA ? hardcodedIsLoading : isLoading,
      fetchError: USE_HARDCODED_DATA ? undefined : error,
      hasMore: USE_HARDCODED_DATA ? false : data?.at(-1)?.data?.links?.some((link) => link.rel === 'next') ?? false,
      isValidating: USE_HARDCODED_DATA ? false : isValidating,
      setPage: setSize,
      currentPage: USE_HARDCODED_DATA ? 1 : size,
      totalResults: USE_HARDCODED_DATA ? hardcodedData?.length ?? 0 : data?.[0]?.data?.totalCount ?? 0,
    }),
    [mappedData, isLoading, error, data, isValidating, setSize, size, hardcodedIsLoading, hardcodedData],
  );
}


