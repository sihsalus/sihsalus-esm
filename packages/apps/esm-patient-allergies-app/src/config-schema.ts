import { Type } from '@openmrs/esm-framework';

export interface AllergiesConfigObject {
  concepts: {
    drugAllergenUuid: string;
    environmentalAllergenUuid: string;
    foodAllergenUuid: string;
    mildReactionUuid: string;
    moderateReactionUuid: string;
    severeReactionUuid: string;
    allergyReactionUuid: string;
    otherConceptUuid: string;
  };
}

export const configSchema = {
  concepts: {
    drugAllergenUuid: {
      _type: Type.ConceptUuid,
      _default: 'b864c337-64b1-4125-a4b2-f80b14d9a9b1',
    },
    environmentalAllergenUuid: {
      _type: Type.ConceptUuid,
      _default: 'da133de2-1778-46c4-9511-8611fa748002',
    },
    foodAllergenUuid: {
      _type: Type.ConceptUuid,
      _default: 'e85eb507-376b-4cc6-acf1-dec870ba421c',
    },
    mildReactionUuid: {
      _type: Type.ConceptUuid,
      _default: '0c6478bd-ea06-40b2-a93f-a0a1f5c13b97',
    },
    moderateReactionUuid: {
      _type: Type.ConceptUuid,
      _default: 'aed747d5-fba0-49fc-9e29-ebc56b62fb22',
    },
    severeReactionUuid: {
      _type: Type.ConceptUuid,
      _default: 'b1b29870-eccd-4821-847c-668df29b4ad4',
    },
    allergyReactionUuid: {
      _type: Type.ConceptUuid,
      _default: 'da2977c6-bb36-4ae2-b12d-46ede2d4fbec',
    },
    otherConceptUuid: {
      _type: Type.ConceptUuid,
      _default: '62bd5ec8-5ffb-4ddc-97b4-84fde7bab601',
    },
  },
};
