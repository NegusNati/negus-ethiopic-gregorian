import { describe, it, expect } from 'vitest';
import { toGregorian, toEthiopic } from '../src';
import type { EthiopicDate, GregorianDate } from '../src';

describe('Core conversions', () => {
  it('Ethiopic 2017-01-01 (Meskerem 1, 2017 EC) → Gregorian 2024-09-11', () => {
    const e: EthiopicDate = { year: 2017, month: 1, day: 1 };
    const g = toGregorian(e);
    expect(g).toEqual({ year: 2024, month: 9, day: 11 });
  });

  it('Gregorian 2025-01-07 → Ethiopic 2017-04-29 (Genna / Tahsas 29)', () => {
    const g: GregorianDate = { year: 2025, month: 1, day: 7 };
    const e = toEthiopic(g);
    expect(e).toEqual({ year: 2017, month: 4, day: 29, era: 'AM' });
  });

  it('Round-trip stability across random samples (spot check)', () => {
    const samples: GregorianDate[] = [
      { year: 1997, month: 9, day: 29 },
      { year: 2000, month: 2, day: 29 },
      { year: 2010, month: 3, day: 15 },
      { year: 2024, month: 9, day: 27 }
    ];
    for (const s of samples) {
      const e = toEthiopic(s);
      const b = toGregorian(e);
      expect(b).toEqual(s);
    }
  });
});
