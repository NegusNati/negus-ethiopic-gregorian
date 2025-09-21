import { describe, it, expect } from 'vitest';
import { yearProgress, addDays, nextMonth } from '../src';

describe('Utilities', () => {
  it('Year progress (Gregorian)', () => {
    const r = yearProgress({ year: 2025, month: 1, day: 1 }, 'gregorian');
    expect(r.totalDaysInYear).toBe(365);
    expect(r.daysLeft).toBe(365);
    expect(r.percentCompleted).toBe(0);
  });

  it('Day arithmetic via JDN boundaries', () => {
    const d = addDays({ year: 2025, month: 12, day: 31 }, 1, 'gregorian');
    expect(d).toEqual({ year: 2026, month: 1, day: 1 });
  });

  it('Ethiopic month roll', () => {
    const d = nextMonth({ year: 2017, month: 13, day: 5, era: 'AM' }, 'ethiopic');
    expect(d).toEqual({ year: 2018, month: 1, day: 30, era: 'AM' });
  });
});
