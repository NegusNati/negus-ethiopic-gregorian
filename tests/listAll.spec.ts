import { describe, it, expect } from 'vitest';
import { listAllHighlights, gregorianToJdn } from '../src';

describe('listAllHighlights', () => {
  it('dedupes canonical ids (genna, meskel) for Gregorian 2025', () => {
    const all = listAllHighlights(2025, 'gregorian');
    const ids = all.map(h => h.id);
    // Should contain canonical ids, not their Gregorian duplicates
    expect(ids).toContain('genna');
    expect(ids).toContain('meskel');
    expect(ids).not.toContain('genna_g');
    expect(ids).not.toContain('meskel_g');

    const genna = all.find(h => h.id === 'genna')!;
    expect(genna.gregorian.month).toBe(1);
    expect(genna.gregorian.day).toBe(7);
  });

  it('is sorted by Gregorian date', () => {
    const all = listAllHighlights(2025, 'gregorian');
    for (let i = 1; i < all.length; i++) {
      const a = gregorianToJdn(all[i - 1].gregorian.year, all[i - 1].gregorian.month, all[i - 1].gregorian.day);
      const b = gregorianToJdn(all[i].gregorian.year, all[i].gregorian.month, all[i].gregorian.day);
      expect(a).toBeLessThanOrEqual(b);
    }
  });
});

