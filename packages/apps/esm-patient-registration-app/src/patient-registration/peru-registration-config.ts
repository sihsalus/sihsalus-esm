import { type FieldDefinition, type RegistrationConfig, type SectionDefinition } from '../config-schema';

const dniIdentifierTypeUuid = '550e8400-e29b-41d4-a716-446655440001';

const peruSections = ['filiation', 'responsiblePerson'];
const minorResponsibleRelationshipTypes = [
  '8d91a210-c2cc-11de-8d13-0010c6dffdff/aIsToB',
  '8d91a210-c2cc-11de-8d13-0010c6dffd0f/aIsToB',
  '057de23f-3d9c-4314-9391-4452970739c6/aIsToB',
];

const peruSectionDefinitions: Array<SectionDefinition> = [
  {
    id: 'filiation',
    name: 'Datos de filiación',
    fields: [
      'birthplace',
      'civilStatus',
      'ethnicity',
      'nativeLanguage',
      'occupation',
      'educationLevel',
      'religion',
      'insuranceType',
      'insuranceCode',
      'bloodType',
      'mothersName',
    ],
  },
  {
    id: 'responsiblePerson',
    name: 'Acompañante o responsable',
    fields: ['companionName', 'companionAge', 'companionRelationship'],
  },
];

const peruFieldDefinitions: Array<FieldDefinition> = [
  {
    id: 'birthplace',
    type: 'person attribute',
    uuid: '8d8718c2-c2cc-11de-8d13-0010c6dffd0f',
    label: 'Lugar de nacimiento',
    showHeading: false,
  },
  {
    id: 'civilStatus',
    type: 'person attribute',
    uuid: '8d871f2a-c2cc-11de-8d13-0010c6dffd0f',
    label: 'Estado civil',
    showHeading: false,
    answerConceptSetUuid: 'aa345a81-3811-4e9c-be18-d6be727623e0',
  },
  {
    id: 'ethnicity',
    type: 'person attribute',
    uuid: '8d871386-c2cc-11de-8d13-0010c6dffd0f',
    label: 'Etnia',
    showHeading: false,
    answerConceptSetUuid: '70482c1e-181e-416d-a0c4-a93919f9f2ef',
  },
  {
    id: 'nativeLanguage',
    type: 'person attribute',
    uuid: '8d872150-c2cc-11de-8d13-0010c6dffd0f',
    label: 'Idioma nativo',
    showHeading: false,
  },
  {
    id: 'occupation',
    type: 'person attribute',
    uuid: '8d871afc-c2cc-11de-8d13-0010c6dffd0f',
    label: 'Ocupación',
    showHeading: false,
  },
  {
    id: 'educationLevel',
    type: 'person attribute',
    uuid: '8d87236c-c2cc-11de-8d13-0010c6dffd0f',
    label: 'Grado de instrucción',
    showHeading: false,
    answerConceptSetUuid: '2d790984-f088-4d68-984d-efab9db8c889',
  },
  {
    id: 'religion',
    type: 'person attribute',
    uuid: '77bbb234-2312-4644-99d0-fa894d438817',
    label: 'Religión',
    showHeading: false,
    answerConceptSetUuid: '6de6d87e-5af8-41d9-98d2-b660fabf25d9',
  },
  {
    id: 'insuranceType',
    type: 'person attribute',
    uuid: '56188294-b42c-481d-a987-4b495116c580',
    label: 'Tipo de seguro',
    showHeading: false,
    answerConceptSetUuid: '355ee63a-a773-47ab-9841-2505b71dec13',
  },
  {
    id: 'insuranceCode',
    type: 'person attribute',
    uuid: '374b130f-7457-476f-87b1-f182aa77c434',
    label: 'Código de seguro',
    showHeading: false,
  },
  {
    id: 'bloodType',
    type: 'person attribute',
    uuid: 'b4c7d8e9-f0a1-4b2c-8d3e-5f6789abcdef',
    label: 'Tipo de sangre',
    showHeading: false,
    answerConceptSetUuid: '3f6056ed-17e9-4b3b-98a7-18dc431a7e99',
  },
  {
    id: 'mothersName',
    type: 'person attribute',
    uuid: '8d871d18-c2cc-11de-8d13-0010c6dffd0f',
    label: 'Nombre de la madre',
    showHeading: false,
  },
  {
    id: 'companionName',
    type: 'person attribute',
    uuid: '4697d0e6-5b24-416b-aee6-708cd9a3a1db',
    label: 'Nombre del acompañante o responsable',
    showHeading: false,
  },
  {
    id: 'companionAge',
    type: 'person attribute',
    uuid: '70ce4571-2e2e-44da-a39f-9dae2a658606',
    label: 'Edad del acompañante o responsable',
    showHeading: false,
  },
  {
    id: 'companionRelationship',
    type: 'person attribute',
    uuid: 'a180fa5f-c44e-4490-a981-d7196b70c6ac',
    label: 'Parentesco del acompañante o responsable',
    showHeading: false,
  },
];

function appendMissingById<T extends { id: string }>(configured: Array<T>, defaults: Array<T>) {
  const configuredIds = new Set(configured.map((item) => item.id));
  return [...configured, ...defaults.filter((item) => !configuredIds.has(item.id))];
}

function mergeSectionDefinitions(configured: Array<SectionDefinition>, defaults: Array<SectionDefinition>) {
  const defaultsById = new Map(defaults.map((section) => [section.id, section]));

  return appendMissingById(
    configured.map((section) => {
      const defaultSection = defaultsById.get(section.id);
      if (!defaultSection) {
        return section;
      }

      return {
        ...defaultSection,
        ...section,
        fields: [...section.fields, ...defaultSection.fields.filter((field) => !section.fields.includes(field))],
      };
    }),
    defaults,
  );
}

export function getEffectiveRegistrationConfig(config: RegistrationConfig): RegistrationConfig {
  const sections = [...config.sections];

  peruSections.forEach((section) => {
    if (sections.includes(section)) {
      return;
    }
    const relationshipsIndex = sections.indexOf('relationships');
    if (relationshipsIndex >= 0) {
      sections.splice(relationshipsIndex, 0, section);
    } else {
      sections.push(section);
    }
  });

  const defaultPatientIdentifierTypes = config.defaultPatientIdentifierTypes.includes(dniIdentifierTypeUuid)
    ? config.defaultPatientIdentifierTypes
    : [...config.defaultPatientIdentifierTypes, dniIdentifierTypeUuid];

  return {
    ...config,
    sections,
    sectionDefinitions: mergeSectionDefinitions(config.sectionDefinitions, peruSectionDefinitions),
    fieldDefinitions: appendMissingById(config.fieldDefinitions, peruFieldDefinitions),
    fieldConfigurations: {
      ...config.fieldConfigurations,
      name: {
        ...config.fieldConfigurations.name,
        requireFamilyName2: true,
      },
    },
    relationshipOptions: {
      ...config.relationshipOptions,
      minorResponsibleRelationshipTypes,
    },
    defaultPatientIdentifierTypes,
  };
}
