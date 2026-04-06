import { type PriorityConfig } from '../config-schema';
import {
  getPriorityConfigByUuid,
  getPriorityConfigByCode,
  getPriorityConfigByLabel,
  getPriorityColor,
  getPriorityLabel,
  getPrioritySortWeight,
  sortByPriority,
  getAllPriorities,
  isWaitTimeExceeded,
  getPriorityCssClass,
} from './priority-helpers';

const mockConfigs: PriorityConfig[] = [
  {
    code: 'PRIORITY_I',
    conceptUuid: 'uuid-1',
    label: 'Prioridad I',
    description: 'Emergencia inmediata',
    color: 'red',
    style: 'bold',
    sortWeight: 0,
    maxWaitTimeMinutes: 0,
  },
  {
    code: 'PRIORITY_II',
    conceptUuid: 'uuid-2',
    label: 'Prioridad II',
    description: 'Emergencia urgente',
    color: 'orange',
    style: 'bold',
    sortWeight: 1,
    maxWaitTimeMinutes: 10,
  },
  {
    code: 'PRIORITY_III',
    conceptUuid: 'uuid-3',
    label: 'Prioridad III',
    description: 'Urgencia médica',
    color: 'yellow',
    style: 'bold',
    sortWeight: 2,
    maxWaitTimeMinutes: 60,
  },
  {
    code: 'PRIORITY_IV',
    conceptUuid: 'uuid-4',
    label: 'Prioridad IV',
    description: 'Urgencia menor',
    color: 'green',
    style: 'bold',
    sortWeight: 3,
    maxWaitTimeMinutes: 120,
  },
];

describe('getPriorityConfigByUuid', () => {
  it('returns config for known UUID', () => {
    expect(getPriorityConfigByUuid('uuid-1', mockConfigs)?.code).toBe('PRIORITY_I');
  });

  it('returns undefined for unknown UUID', () => {
    expect(getPriorityConfigByUuid('unknown', mockConfigs)).toBeUndefined();
  });
});

describe('getPriorityConfigByCode', () => {
  it('returns config for known code', () => {
    expect(getPriorityConfigByCode('PRIORITY_III', mockConfigs)?.conceptUuid).toBe('uuid-3');
  });

  it('returns undefined for unknown code', () => {
    expect(getPriorityConfigByCode('PRIORITY_V', mockConfigs)).toBeUndefined();
  });
});

describe('getPriorityConfigByLabel', () => {
  it('returns config for known label', () => {
    expect(getPriorityConfigByLabel('Prioridad II', mockConfigs)?.code).toBe('PRIORITY_II');
  });

  it('returns undefined for unknown label', () => {
    expect(getPriorityConfigByLabel('Unknown', mockConfigs)).toBeUndefined();
  });
});

describe('getPriorityColor', () => {
  it('returns correct color for known UUID', () => {
    expect(getPriorityColor('uuid-1', mockConfigs)).toBe('red');
    expect(getPriorityColor('uuid-4', mockConfigs)).toBe('green');
  });

  it('returns gray for unknown UUID', () => {
    expect(getPriorityColor('unknown', mockConfigs)).toBe('gray');
  });
});

describe('getPriorityLabel', () => {
  it('returns correct label for known UUID', () => {
    expect(getPriorityLabel('uuid-2', mockConfigs)).toBe('Prioridad II');
  });

  it('returns "Desconocida" for unknown UUID', () => {
    expect(getPriorityLabel('unknown', mockConfigs)).toBe('Desconocida');
  });
});

describe('getPrioritySortWeight', () => {
  it('returns correct weight for known UUID', () => {
    expect(getPrioritySortWeight('uuid-1', mockConfigs)).toBe(0);
    expect(getPrioritySortWeight('uuid-4', mockConfigs)).toBe(3);
  });

  it('returns 999 for unknown UUID', () => {
    expect(getPrioritySortWeight('unknown', mockConfigs)).toBe(999);
  });
});

describe('sortByPriority', () => {
  it('sorts entries by priority (highest first)', () => {
    const entries = [
      { priority: { uuid: 'uuid-4' }, name: 'D' },
      { priority: { uuid: 'uuid-1' }, name: 'A' },
      { priority: { uuid: 'uuid-3' }, name: 'C' },
      { priority: { uuid: 'uuid-2' }, name: 'B' },
    ];

    const sorted = sortByPriority(entries, mockConfigs);
    expect(sorted.map((e) => e.name)).toEqual(['A', 'B', 'C', 'D']);
  });

  it('does not mutate the original array', () => {
    const entries = [
      { priority: { uuid: 'uuid-3' } },
      { priority: { uuid: 'uuid-1' } },
    ];
    const original = [...entries];
    sortByPriority(entries, mockConfigs);
    expect(entries).toEqual(original);
  });

  it('places unknown priorities last', () => {
    const entries = [
      { priority: { uuid: 'unknown' }, name: 'X' },
      { priority: { uuid: 'uuid-1' }, name: 'A' },
    ];

    const sorted = sortByPriority(entries, mockConfigs);
    expect(sorted[0].name).toBe('A');
    expect(sorted[1].name).toBe('X');
  });
});

describe('getAllPriorities', () => {
  it('returns all priorities with correct structure', () => {
    const all = getAllPriorities(mockConfigs);
    expect(all).toHaveLength(4);
    expect(all[0]).toEqual({
      uuid: 'uuid-1',
      code: 'PRIORITY_I',
      label: 'Prioridad I',
      description: 'Emergencia inmediata',
      color: 'red',
      sortWeight: 0,
      maxWaitTimeMinutes: 0,
    });
  });
});

describe('isWaitTimeExceeded', () => {
  it('returns true for Priority I with any wait time > 0', () => {
    expect(isWaitTimeExceeded('uuid-1', 1, mockConfigs)).toBe(true);
  });

  it('returns false for Priority I with 0 wait time', () => {
    expect(isWaitTimeExceeded('uuid-1', 0, mockConfigs)).toBe(false);
  });

  it('returns true when wait time exceeds maximum', () => {
    expect(isWaitTimeExceeded('uuid-2', 11, mockConfigs)).toBe(true);
    expect(isWaitTimeExceeded('uuid-3', 61, mockConfigs)).toBe(true);
  });

  it('returns false when wait time is within limit', () => {
    expect(isWaitTimeExceeded('uuid-2', 10, mockConfigs)).toBe(false);
    expect(isWaitTimeExceeded('uuid-3', 60, mockConfigs)).toBe(false);
  });

  it('returns false for unknown priority', () => {
    expect(isWaitTimeExceeded('unknown', 999, mockConfigs)).toBe(false);
  });
});

describe('getPriorityCssClass', () => {
  it('returns correct CSS class for known UUID', () => {
    expect(getPriorityCssClass('uuid-1', mockConfigs)).toBe('priority-priority-i');
    expect(getPriorityCssClass('uuid-4', mockConfigs)).toBe('priority-priority-iv');
  });

  it('returns "priority-unknown" for unknown UUID', () => {
    expect(getPriorityCssClass('unknown', mockConfigs)).toBe('priority-unknown');
  });
});
