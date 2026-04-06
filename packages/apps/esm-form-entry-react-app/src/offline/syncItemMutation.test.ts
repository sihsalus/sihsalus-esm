import type { EncounterCreate } from '../types';

import { mutateEncounterCreateToPartialEncounter } from './syncItemMutation';

jest.mock('uuid', () => ({
  validate: jest.fn((val: string) => {
    // Simple UUID v4 validation
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
  }),
}));

describe('mutateEncounterCreateToPartialEncounter', () => {
  it('converts UUID strings to objects', () => {
    const encounterCreate: EncounterCreate = {
      encounterDatetime: '2024-01-01T08:00:00.000+0000',
      patient: 'e22e39fd-7db2-45e7-80f1-60fa0d5a4378',
      encounterType: 'a22e39fd-7db2-45e7-80f1-60fa0d5a4378',
      location: 'b22e39fd-7db2-45e7-80f1-60fa0d5a4378',
    };

    const result = mutateEncounterCreateToPartialEncounter(encounterCreate);

    expect(result.patient).toEqual({ uuid: 'e22e39fd-7db2-45e7-80f1-60fa0d5a4378' });
    expect(result.encounterType).toEqual({ uuid: 'a22e39fd-7db2-45e7-80f1-60fa0d5a4378' });
    expect(result.location).toEqual({ uuid: 'b22e39fd-7db2-45e7-80f1-60fa0d5a4378' });
  });

  it('handles obs concept UUIDs including non-standard formats', () => {
    const encounterCreate: any = {
      encounterDatetime: '2024-01-01',
      patient: 'e22e39fd-7db2-45e7-80f1-60fa0d5a4378',
      encounterType: 'a22e39fd-7db2-45e7-80f1-60fa0d5a4378',
      location: 'b22e39fd-7db2-45e7-80f1-60fa0d5a4378',
      obs: [
        {
          concept: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // non-standard UUID
          value: 'test',
        },
      ],
    };

    const result = mutateEncounterCreateToPartialEncounter(encounterCreate);

    // Non-standard UUID should be converted by the manual path mutation
    expect((result as any).obs[0].concept).toEqual({ uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
  });

  it('does not modify the uuid key itself', () => {
    const encounterCreate: any = {
      uuid: 'c22e39fd-7db2-45e7-80f1-60fa0d5a4378',
      encounterDatetime: '2024-01-01',
      patient: 'e22e39fd-7db2-45e7-80f1-60fa0d5a4378',
      encounterType: 'a22e39fd-7db2-45e7-80f1-60fa0d5a4378',
      location: 'b22e39fd-7db2-45e7-80f1-60fa0d5a4378',
    };

    const result = mutateEncounterCreateToPartialEncounter(encounterCreate);
    // uuid should remain a string
    expect((result as any).uuid).toBe('c22e39fd-7db2-45e7-80f1-60fa0d5a4378');
  });
});
