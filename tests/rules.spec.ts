import { describe, it, expect } from 'vitest';
import { gregorianToJdn, toEthiopic } from '../src';
import { DYNAMIC_GREGORIAN_HIGHLIGHTS, orthodoxEasterGregorian, goodFridayGregorian, hosannaGregorian } from '../src/highlights/rules';

describe('Dynamic rules sanity', () => {
  const years = [2024, 2025, 2026];

  it('Orthodox Easter / Good Friday / Hosanna have correct ordering', () => {
    for (const y of years) {
      const easter = orthodoxEasterGregorian(y);
      const gf = goodFridayGregorian(y);
      const hos = hosannaGregorian(y);
      const je = gregorianToJdn(easter.year, easter.month, easter.day);
      const jg = gregorianToJdn(gf.year, gf.month, gf.day);
      const jh = gregorianToJdn(hos.year, hos.month, hos.day);
      expect(jg).toBeLessThan(je);   // Good Friday before Easter
      expect(jh).toBe(je - 7);       // Hosanna exactly 7 days before Easter
    }
  });

  it('Islamic/Eid and Mawlid produce at least one date per Gregorian year', () => {
    const ids = new Set(['eid_al_fitr', 'eid_al_adha', 'mawlid']);
    for (const y of years) {
      for (const rule of DYNAMIC_GREGORIAN_HIGHLIGHTS) {
        if (!ids.has(rule.id)) continue;
        const occ = rule.occurrences(y);
        expect(occ.length).toBeGreaterThanOrEqual(1);
        expect(occ.length).toBeLessThanOrEqual(2);
        for (const d of occ) {
          expect(d.month).toBeGreaterThanOrEqual(1);
          expect(d.month).toBeLessThanOrEqual(12);
          expect(d.day).toBeGreaterThanOrEqual(1);
          expect(d.day).toBeLessThanOrEqual(31);
          // round-trip to Ethiopic should not throw
          toEthiopic({ year: y, month: d.month, day: d.day });
        }
      }
    }
  });
});
