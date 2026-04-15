export interface Relationship {
  display: string;
  uuid: string;
  personA: Person;
  personB: Person;
  relationshipType: {
    uuid: string;
    display: string;
    aIsToB: string;
    bIsToA: string;
  };
  startDate: string;
  endDate: string | null;
}

export interface Contact {
  uuid: string;
  name: string;
  display: string;
  relativeAge: number;
  dead: boolean;
  causeOfDeath: string;
  relativeUuid: string;
  relationshipType: string;
  patientUuid: string;
  gender: string;
  contact: string | null;
  startDate: string | null;
  endDate: string | null;
  baselineHIVStatus: string | null;
  personContactCreated: string | null;
  livingWithClient: string | null;
  pnsAproach: string | null;
  ipvOutcome: string | null;
  age: number | null;
}

export interface Person {
  uuid: string;
  age: number;
  dead: boolean;
  display: string;
  causeOfDeath: string;
  gender: string;
  deathDate: string;
  attributes: {
    uuid: string;
    display: string;
    value: string;
    attributeType: {
      uuid: string;
      display: string;
    };
  }[];
}

export interface Patient {
  uuid: string;
  person: Person;
  identifiers: {
    uuid: string;
  }[];
}

export interface RelationShipType {
  uuid: string;
  displayAIsToB: string;
  displayBIsToA: string;
}

export interface Enrollment {
  uuid: string;
  program: {
    name: string;
    uuid: string;
  };
}

export interface HTSEncounter {
  uuid: string;
  display: string;
  encounterDatetime: string;
  obs: {
    uuid: string;
    display: string;
    value: {
      uuid: string;
      display: string;
    };
  }[];
}
