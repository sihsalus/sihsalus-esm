// hooks/useCREDFormsForAgeGroup.ts

import { useMemo } from 'react';
import type { ConfigObject } from '../config-schema';
import { calculateAgeInMonths, getAgeGroup } from '../utils/age-group-utils';
import type { CompletedFormInfo } from '../types';

export function useCREDFormsForAgeGroup(config: ConfigObject, birthDate: string | undefined): CompletedFormInfo[] {
  return useMemo(() => {
    if (!birthDate || !config?.CREDFormsByAgeGroup || !config?.formsList) return [];

    const months = calculateAgeInMonths(birthDate);

    const matchedGroup = getAgeGroup(months, config.CREDFormsByAgeGroup);

    if (!matchedGroup || !matchedGroup.forms) return [];

    return matchedGroup.forms
      .map((formKey) => {
        const formDef = config.formsList?.[formKey];
        if (!formDef) return null;
        return {
          form: {
            ...formDef,
            formCategory: 'CRED',
          },
          associatedEncounters: [],
          lastCompletedDate: undefined,
        };
      })
      .filter(Boolean) as CompletedFormInfo[];
  }, [birthDate, config]);
}
