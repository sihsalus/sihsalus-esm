import { generateCREDSchedule, getCREDControlDefinitions } from './cred-schedule-rules';

describe('cred-schedule-rules', () => {
  it('exposes the 33 expected static control definitions', () => {
    const definitions = getCREDControlDefinitions();

    expect(definitions).toHaveLength(33);
    expect(definitions[0]).toEqual(
      expect.objectContaining({
        controlNumber: 1,
        label: 'RN - 48h',
        phase: 'neonatal',
      }),
    );
    expect(definitions.at(-1)).toEqual(
      expect.objectContaining({
        controlNumber: 33,
        label: '12 años',
        phase: 'school',
      }),
    );
  });

  it('builds a concrete schedule from the provided birth date', () => {
    const schedule = generateCREDSchedule('2024-01-01T00:00:00.000Z');

    expect(schedule).toHaveLength(33);
    expect(schedule[0]).toEqual(
      expect.objectContaining({
        controlNumber: 1,
        targetDate: new Date('2024-01-03T00:00:00.000Z'),
      }),
    );
    expect(schedule[4]).toEqual(
      expect.objectContaining({
        controlNumber: 5,
        label: '1 mes',
        targetDate: new Date('2024-01-31T00:00:00.000Z'),
      }),
    );
    expect(schedule.at(-1)).toEqual(
      expect.objectContaining({
        controlNumber: 33,
        targetDate: new Date('2036-01-01T00:00:00.000Z'),
      }),
    );
  });
});
