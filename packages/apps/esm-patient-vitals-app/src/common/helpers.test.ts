import { assessValue } from './helpers';

describe('assessValue', () => {
  it('treats zero as a valid value when evaluating ranges', () => {
    expect(
      assessValue(0, {
        hiNormal: 10,
        hiAbsolute: 20,
        hiCritical: 15,
        lowNormal: 1,
        lowAbsolute: 0,
        lowCritical: 0,
      }),
    ).toBe('critically_low');
  });
});
