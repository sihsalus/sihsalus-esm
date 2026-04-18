import { getEncounterProperty, getObsFromEncounter } from './helpers';

const config = {
  trueConceptUuid: 'true-concept',
  falseConceptUuid: 'false-concept',
  otherConceptUuid: 'other-concept',
};

describe('clinical view helpers', () => {
  it('returns the display value for object observations without nested name objects', () => {
    const encounter = {
      obs: [
        {
          concept: { uuid: 'concept-uuid' },
          obsDatetime: '2026-04-17T10:00:00.000Z',
          value: {
            uuid: 'answer-uuid',
            display: 'Recovered',
          },
        },
      ],
    } as any;

    expect(
      getObsFromEncounter({
        encounter,
        obsConcept: 'concept-uuid',
        config,
      }),
    ).toBe('Recovered');
  });

  it('returns only defined provider names when encounter providers are partially populated', () => {
    const encounter = {
      encounterProviders: [{ provider: { name: 'Dr Cook' } }, { provider: {} }],
    } as any;

    expect(getEncounterProperty(encounter, 'provider')).toBe('Dr Cook');
  });
});
