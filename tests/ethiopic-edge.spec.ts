import { describe, it, expect } from 'vitest';
import { ethiopicDaysInMonth, isEthiopicLeapYear, toGregorian } from '../src';

describe('Ethiopic edge cases', () => {
  it('Pagumen has 6 days in leap years (AM % 4 === 3)', () => {
    const leapYear = 2011; // 2011 % 4 === 3 → leap
    expect(isEthiopicLeapYear(leapYear)).toBe(true);
    expect(ethiopicDaysInMonth(leapYear, 13)).toBe(6);
    const g = toGregorian({ year: leapYear, month: 13, day: 6, era: 'AM' });
    // Should produce a valid Gregorian date
    expect(g.month).toBeGreaterThanOrEqual(1);
    expect(g.month).toBeLessThanOrEqual(12);
  });
});

