import type { Encounter, MenuCardProps } from '../types';

import { getEncounterTileColumns } from './index';

const config = {
  trueConceptUuid: 'true-concept',
  falseConceptUuid: 'false-concept',
  otherConceptUuid: 'other-concept',
};

describe('clinical view column utilities', () => {
  it('uses display values when observation objects do not include nested concept names', () => {
    const columns = getEncounterTileColumns(
      {
        tileHeader: 'Test tile',
        columns: [
          {
            id: 'status',
            title: 'Status',
            concept: 'concept-uuid',
            encounterType: 'encounter-type-uuid',
          },
        ],
      } as MenuCardProps,
      config,
    );

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
    } as unknown as Encounter;

    expect(columns[0].getObsValue(encounter)).toBe('Recovered');
  });
});
