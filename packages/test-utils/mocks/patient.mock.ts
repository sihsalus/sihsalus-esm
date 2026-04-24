import type { Patient, PersonAddress } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { mockAddress } from './address.mock';

export const mockFhirPatient: fhir.Patient = {
  resourceType: 'Patient',
  id: 'bfa09dac-ec9e-47c1-9ad3-e3ebdd5d722d',
  meta: {
    versionId: '1719312976000',
    lastUpdated: '2024-06-25T10:56:16.000+00:00',
  },
  text: {
    status: 'generated',
    div: '<div xmlns="http://www.w3.org/1999/xhtml"><table class="hapiPropertyTable"><tbody><tr><td>Id:</td><td>bfa09dac-ec9e-47c1-9ad3-e3ebdd5d722d</td></tr><tr><td>Identifier:</td><td><div>100008E</div></td></tr><tr><td>Active:</td><td>true</td></tr><tr><td>Name:</td><td> Joshua <b>JOHNSON </b></td></tr><tr><td>Telecom:</td><td> +255777053243 </td></tr><tr><td>Gender:</td><td>MALE</td></tr><tr><td>Birth Date:</td><td>25/09/2019</td></tr><tr><td>Deceased:</td><td>false</td></tr><tr><td>Address:</td><td><span>Wakiso </span><span>Kayunga </span><span>Uganda </span></td></tr></tbody></table></div>',
  },
  identifier: [
    {
      id: 'fc6b122a-05bd-4128-8577-7efd8c87cda5',
      extension: [
        {
          url: 'http://fhir.openmrs.org/ext/patient/identifier#location',
          valueReference: {
            reference: 'Location/736b08f9-94d6-4b50-ad58-6bc69b9cbfb8',
            display: 'Ward 50',
          },
        },
      ],
      use: 'official',
      type: {
        coding: [
          {
            code: '05a29f94-c0ed-11e2-94be-8c13b969e334',
          },
        ],
        text: 'OpenMRS ID',
      },
      value: '100008E',
    },
  ],
  active: true,
  name: [
    {
      id: '67ac67de-aac4-43b3-a0d4-677578a01047',
      text: 'Joshua Johnson',
      family: 'Johnson',
      given: ['Joshua'],
    },
  ],
  telecom: [
    {
      id: 'f3f3c756-d8f1-42ce-8d32-eefe2a86c306',
      value: '+255777053243',
    },
  ],
  gender: 'male',
  birthDate: '2019-09-25',
  deceasedBoolean: false,
  address: [
    {
      id: '1e9df4ab-0c73-4f99-b0bd-c2ddc239619b',
      extension: [
        {
          url: 'http://fhir.openmrs.org/ext/address',
          extension: [
            {
              url: 'http://fhir.openmrs.org/ext/address#address1',
              valueString: 'Nansana',
            },
          ],
        },
      ],
      use: 'home',
      city: 'Wakiso',
      state: 'Kayunga',
      postalCode: '00000',
      country: 'Uganda',
    },
  ],
};

const birthdate = '2000-01-01T00:00:00.000+0000';
const age = dayjs().diff(birthdate, 'years');

/* Patients as returned by `usePatient` and the service queues endpoints */
export const mockPatientAlice: Patient = {
  uuid: '00000000-0000-0001-0000-000000000000',
  display: 'Alice Johnson',
  identifiers: [],
  person: {
    uuid: '00000000-0001-0000-0000-000000000000',
    display: 'Alice Johnson',
    gender: 'F',
    age: age,
    birthdate: birthdate,
    birthdateEstimated: false,
    dead: false,
    deathDate: null,
    causeOfDeath: null,
    preferredName: {
      display: 'Alice Johnson',
      givenName: 'Alice',
      middleName: '',
      familyName: 'Johnson',
      familyName2: '',
      uuid: 'preferred-name-uuid',
    },
    preferredAddress: mockAddress as PersonAddress,
    names: [null],
    addresses: [],
    attributes: [],
    birthtime: null,
    deathdateEstimated: null,
    causeOfDeathNonCoded: null,
  },
};

export const mockPatientBrian: Patient = {
  uuid: '00000000-0000-0002-0000-000000000000',
  display: 'Brian Johnson',
  identifiers: [],
  person: {
    uuid: '00000000-0001-0000-0000-000000000000',
    display: 'Brian Johnson',
    gender: 'M',
    age: age,
    birthdate: birthdate,
    birthdateEstimated: false,
    dead: false,
    deathDate: null,
    causeOfDeath: null,
    preferredAddress: mockAddress as PersonAddress,
    preferredName: {
      display: 'Brian Johnson',
      givenName: 'Brian ',
      middleName: '',
      familyName: 'Johnson',
      familyName2: '',
      uuid: 'preferred-name-uuid',
    },
    names: [null],
    addresses: [],
    attributes: [],
    birthtime: null,
    deathdateEstimated: null,
    causeOfDeathNonCoded: null,
  },
};
