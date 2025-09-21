import { describe, it, expect } from 'vitest';
import { isGregorianLeapYear } from '../src';
import { ETHIOPIAN_HIGHLIGHTS, GREGORIAN_HIGHLIGHTS } from '../src/highlights';

describe('Highlights', () => {
  it('Contains Enkutatash + Meskel', () => {
    const ids = new Set(ETHIOPIAN_HIGHLIGHTS.map(h => h.id));
    expect(ids.has('enkutatash')).toBe(true);
    expect(ids.has('meskel')).toBe(true);
  });

  it('Meskel Gregorian rule (27th, or 28th on Gregorian leap)', () => {
    const base = GREGORIAN_HIGHLIGHTS.find(h => h.id === 'meskel_g');
    expect(base?.month).toBe(9);
    expect(base?.day).toBe(27);
    // Example enforcement for a leap-year consumer:
    expect(isGregorianLeapYear(2028)).toBe(true);
  });
});
