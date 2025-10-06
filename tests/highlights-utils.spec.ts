import { describe, it, expect } from 'vitest';
import {
  getHighlightsForGregorianDay,
  getHighlightsForEthiopicDay,
  getHighlightsForMonth,
  getHighlightsForYear,
  searchHighlights
} from '../src/highlights';

describe('Highlight Utilities', () => {
  it('should get highlights for specific Ethiopic day', () => {
    const highlights = getHighlightsForEthiopicDay({ year: 2017, month: 1, day: 1, era: 'AM' });
    expect(highlights.length).toBe(1);
    expect(highlights[0].id).toBe('enkutatash');
    expect(highlights[0].amharicName).toBe('እንቁጣጣሽ (ኢትዮጵያ አዲስ ዓመት)');
  });

  it('should include Irreechaa Ethiopic dates', () => {
    const finfinne = getHighlightsForEthiopicDay({ year: 2018, month: 1, day: 24, era: 'AM' });
    expect(finfinne.some(h => h.id === 'irreechaa_finfinne')).toBe(true);

    const bishoftu = getHighlightsForEthiopicDay({ year: 2018, month: 1, day: 25, era: 'AM' });
    expect(bishoftu.some(h => h.id === 'irreechaa_bishoftu')).toBe(true);
  });

  it('should get highlights for specific Gregorian day', () => {
    const highlights = getHighlightsForGregorianDay({ year: 2025, month: 1, day: 1 });
    expect(highlights.length).toBe(1);
    expect(highlights[0].id).toBe('g_new_year');
    expect(highlights[0].amharicName).toBe('አዲስ ዓመት ቀን');
  });

  it('should get highlights for Ethiopic month', () => {
    const highlights = getHighlightsForMonth(1, 1, 'ethiopic');
    // Should include at least Enkutatash, Demera, Meskel in Meskerem
    const ids = highlights.map(h => h.id);
    expect(ids).toContain('enkutatash');
    expect(ids).toContain('demera');
    expect(ids).toContain('meskel');
  });

  it('should get highlights for Gregorian month', () => {
    const highlights = getHighlightsForMonth(2025, 5, 'gregorian');
    expect(highlights.length).toBe(3);
    const ids = highlights.map(h => h.id);
    expect(ids).toContain('labour');
    expect(ids).toContain('patriots');
    expect(ids).toContain('derg');
  });

  it('should search highlights by English name', () => {
    const results = searchHighlights('New Year');
    // Expect Ethiopian New Year (Enkutatash), its Gregorian counterpart, and Gregorian New Year
    expect(results.length).toBeGreaterThanOrEqual(3);
    const ids = results.map(h => h.id);
    expect(ids).toContain('enkutatash');
    expect(ids).toContain('enkutatash_g');
    expect(ids).toContain('g_new_year');
  });

  it('should include Irreechaa dates in Gregorian lookups', () => {
    const saturday = getHighlightsForGregorianDay({ year: 2025, month: 10, day: 4 });
    expect(saturday.some(h => h.id === 'irreechaa_finfinne')).toBe(true);

    const sunday = getHighlightsForGregorianDay({ year: 2025, month: 10, day: 5 });
    expect(sunday.some(h => h.id === 'irreechaa_bishoftu')).toBe(true);

    const octoberHighlights = getHighlightsForMonth(2025, 10, 'gregorian');
    const ids = octoberHighlights.map(h => h.id);
    expect(ids).toContain('irreechaa_finfinne');
    expect(ids).toContain('irreechaa_bishoftu');
  });

  it('should search highlights by Amharic name', () => {
    const results = searchHighlights('እንቁጣጣሽ');
    expect(results.length).toBeGreaterThanOrEqual(2);
    const ids = results.map(h => h.id);
    expect(ids).toContain('enkutatash');
    expect(ids).toContain('enkutatash_g');
  });

  it('should search highlights by Oromo name', () => {
    const results = searchHighlights('Irreechaa');
    const ids = results.map(h => h.id);
    expect(ids).toContain('irreechaa_finfinne');
    expect(ids).toContain('irreechaa_bishoftu');
  });

  it('should get highlights for year', () => {
    const ethHighlights = getHighlightsForYear(2017, 'ethiopic');
    const ethIds = new Set(ethHighlights.map(h => h.id));
    // Core fixed Ethiopic highlights
    ['enkutatash', 'meskel', 'ketera', 'timkat', 'genna', 'adwa_e', 'patriots_e', 'derg_e', 'irreechaa_finfinne', 'irreechaa_bishoftu'].forEach(id => { expect(ethIds.has(id)).toBe(true); });
    // Dynamic highlights mapped to Ethiopic calendar should also exist
    ['fasika', 'good_friday', 'eid_al_fitr', 'eid_al_adha', 'mawlid'].forEach(id => { expect(Array.from(ethIds).some(x => x === id)).toBe(true); });

    const gregHighlights = getHighlightsForYear(2025, 'gregorian');
    const gregIds = new Set(gregHighlights.map(h => h.id));
    ['g_new_year', 'genna_g', 'adwa', 'labour', 'patriots', 'derg', 'meskel_g', 'christmas', 'irreechaa_finfinne', 'irreechaa_bishoftu'].forEach(id => { expect(gregIds.has(id)).toBe(true); });
    // And dynamic Gregorian highlights should be present for 2025
    ['fasika', 'good_friday', 'eid_al_fitr', 'eid_al_adha', 'mawlid'].forEach(id => { expect(gregIds.has(id)).toBe(true); });
  });

  it('should have Amharic names for all highlights', () => {
    // Test Ethiopian highlights
    expect(getHighlightsForEthiopicDay({ year: 2017, month: 1, day: 1, era: 'AM' })[0].amharicName).toBeTruthy();

    // Test Gregorian highlights
    expect(getHighlightsForGregorianDay({ year: 2025, month: 1, day: 1 })[0].amharicName).toBeTruthy();
  });

  it('should return empty array for dates without highlights', () => {
    const highlights = getHighlightsForEthiopicDay({ year: 2017, month: 2, day: 15, era: 'AM' });
    expect(highlights.length).toBe(0);
  });
});
