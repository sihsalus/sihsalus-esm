import { formatDate, parseDate } from '@openmrs/esm-framework';
import { TRUE_CONCEPT_UUID } from '../../utils/constants';

export function getEncounterValues(encounter, param: string, isDate?: boolean) {
  if (isDate) {
    return formatDate(parseDate(encounter[param]));
  } else {
    return encounter[param] ? encounter[param] : '--';
  }
}

export function formatDateTime(dateString: string): string {
  if (dateString.includes('.')) {
    dateString = dateString.split('.')[0];
  }
  return formatDate(parseDate(dateString));
}

export function obsArrayDateComparator(left: { obsDatetime: string }, right: { obsDatetime: string }): number {
  return new Date(right.obsDatetime).getTime() - new Date(left.obsDatetime).getTime();
}

interface FoundObs {
  value: string | number | { uuid: string; display: string; names?: Array<{ uuid: string; conceptNameType: string; name: string }>; name?: { name: string } } | null;
  obsDatetime?: string;
  [key: string]: unknown;
}

export function findObs(encounter, obsConcept): FoundObs | undefined {
  const allObs = encounter?.obs?.filter((observation) => observation.concept.uuid === obsConcept) || [];
  return allObs?.length == 1 ? allObs[0] : allObs?.sort(obsArrayDateComparator)[0];
}

export function getObsFromEncounters(encounters, obsConcept) {
  const filteredEnc = encounters?.find((enc) => enc.obs.find((obs) => obs.concept.uuid === obsConcept));
  return getObsFromEncounter(filteredEnc, obsConcept);
}

export function getMultipleObsFromEncounter(encounter, obsConcepts: Array<string>) {
  let observations = [];
  obsConcepts.map((concept) => {
    const obs = getObsFromEncounter(encounter, concept);
    if (obs !== '--') {
      observations.push(obs);
    }
  });

  return observations.length ? observations.join(', ') : '--';
}

export function getObsFromEncounter(encounter, obsConcept, isDate?: boolean, isTrueFalseConcept?: boolean) {
  const obs = findObs(encounter, obsConcept);

  if (!obs) {
    return '--';
  }

  if (isTrueFalseConcept) {
    const valueUuid = typeof obs.value === 'object' && obs.value !== null ? obs.value.uuid : undefined;
    if (valueUuid === TRUE_CONCEPT_UUID) {
      return 'Yes';
    } else {
      return 'No';
    }
  }
  if (isDate) {
    return formatDate(parseDate(String(obs.value)), { mode: 'wide' });
  }
  if (typeof obs.value === 'object' && obs.value !== null && obs.value?.names) {
    return (
      obs.value.names.find((conceptName) => conceptName.conceptNameType === 'SHORT')?.name || obs.value.name?.name
    );
  }
  if (typeof obs.value === 'object' && obs.value !== null) {
    return obs.value.display ?? '--';
  }
  return obs.value;
}

export function mapObsValueToFormLabel(
  conceptUuid: string,
  answerConceptUuid: string | undefined,
  formConceptMap: Record<string, Record<string, unknown>>,
  defaultValue: string,
): string {
  const typeOfVal = typeof defaultValue;
  if (typeOfVal === 'number') {
    // check early if value is number and return
    return defaultValue;
  }

  const conceptMapOverride = formConceptMap !== undefined && Object.keys(formConceptMap).length > 0;
  if (conceptMapOverride && answerConceptUuid !== undefined) {
    // check for boolean concepts
    if (answerConceptUuid === '1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') {
      answerConceptUuid = '0';
    } else if (answerConceptUuid === '2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') {
      answerConceptUuid = '1';
    }
    const answers = formConceptMap[conceptUuid]?.answers as Record<string, string> | undefined;
    const theDisplay = answers?.[answerConceptUuid];

    if (typeof theDisplay !== 'undefined') {
      return theDisplay;
    } else {
      return extractDefaultValueBasedOnType(defaultValue);
    }
  } else if (!conceptMapOverride || answerConceptUuid !== undefined) {
    return defaultValue;
  } else {
    return extractDefaultValueBasedOnType(defaultValue);
  }
}

function extractDefaultValueBasedOnType(defaultValue: string | number | Record<string, unknown> | undefined): string {
  if (defaultValue !== undefined) {
    if (typeof defaultValue === 'string') {
      const stringParts = defaultValue.split(':');
      if (stringParts.length === 0 || stringParts.length === 1) {
        return defaultValue;
      } else if (stringParts.length === 2) {
        return stringParts[1];
      } else {
        // TODO: identify other cases to support here
        // check for date
        return formatDate(parseDate(defaultValue));
      }
    } else if (typeof defaultValue === 'object' && defaultValue !== null) {
      return (defaultValue as Record<string, Record<string, string>>)['name']?.['name']; // extract the default name from the object
    }
  }
  return String(defaultValue ?? '');
}
export function mapConceptToFormLabel(conceptUuid: string, formConceptMap: object, defaultValue: string): string {
  if (formConceptMap === undefined) {
    return defaultValue;
  }

  let theDisplay = formConceptMap[conceptUuid] ? formConceptMap[conceptUuid].display : defaultValue;

  return theDisplay;
}

/**
 * This is a util method stub for generating the mapping for labels in the form schema
 * It should be moved to an appropriate place if not here
 */
export function generateFormLabelsFromJSON() {
  const htsScreeningJson = { pages: [] };
  const result = {};
  htsScreeningJson.pages.forEach((page) => {
    page.sections.forEach((section) => {
      section.questions.forEach((question) => {
        let answersMap = {};
        let questionObject = {};
        question.questionOptions.answers?.forEach((ans) => {
          answersMap[ans.concept] = ans.label;
        });
        questionObject['display'] = question.label;
        questionObject['answers'] = answersMap;
        result[question.questionOptions.concept] = questionObject;
      });
    });
  });
}
