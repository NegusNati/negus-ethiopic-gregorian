import { describe, it, expect } from 'vitest';
import { yearProgress, addDays, nextMonth, lastMonth } from '../src';

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

  it('Ethiopic month roll keeps day when moving Pagume → Meskerem', () => {
    const start = { year: 2017, month: 13, day: 5, era: 'AM' } as const;
    const next = nextMonth(start, 'ethiopic');
    expect(next).toEqual({ year: 2018, month: 1, day: 5, era: 'AM' });
  });

  it('Pagume days stay stable across month hops (including leap day)', () => {
    const cases = [
      { year: 2017, month: 13, day: 1, era: 'AM' as const },
      { year: 2017, month: 13, day: 4, era: 'AM' as const },
      { year: 2017, month: 13, day: 5, era: 'AM' as const },
      { year: 2011, month: 13, day: 6, era: 'AM' as const } // 2011 AM is leap (2011 % 4 === 3)
    ];

    cases.forEach(start => {
      const forward = nextMonth(start, 'ethiopic');
      const back = lastMonth(forward, 'ethiopic');
      expect(back).toEqual(start);
    });
  });
});
