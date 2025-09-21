import { describe, it, expect } from 'vitest';
import { getHighlightsForWeek } from '../src';

describe('getHighlightsForWeek includeWeekends', () => {
  it('excludes Saturday/Sunday when includeWeekends=false', () => {
    const highlights = getHighlightsForWeek({ year: 2025, month: 1, day: 13 }, 'gregorian', false);
    for (const h of highlights) {
      const dow = h.date.getDay(); // 0=Sun, 6=Sat
      expect(dow === 0 || dow === 6).toBe(false);
    }
  });
});

