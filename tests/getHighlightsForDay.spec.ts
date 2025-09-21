import { describe, it, expect } from 'vitest';
import { getHighlightsForDay } from '../src/highlights';

describe('getHighlightsForDay dispatch', () => {
  it('returns Gregorian highlights for a Gregorian date', () => {
    const g = getHighlightsForDay({ year: 2025, month: 1, day: 1 }, 'gregorian');
    expect(g.some(h => h.id === 'g_new_year')).toBe(true);
  });

  it('returns Ethiopic highlights for an Ethiopic date', () => {
    const e = getHighlightsForDay({ year: 2017, month: 1, day: 1, era: 'AM' }, 'ethiopic');
    expect(e.some(h => h.id === 'enkutatash')).toBe(true);
  });
});
