// Export all highlight-related types and data
export type { Highlight, HighlightWithDate, ResolvedHighlight, HighlightCategory } from './types';
export { ETHIOPIAN_HIGHLIGHTS } from './ethiopian';
export { GREGORIAN_HIGHLIGHTS } from './gregorian';

// Export utility functions
export {
  getHighlightsForDay,
  getHighlightsForGregorianDay,
  getHighlightsForEthiopicDay,
  getHighlightsForWeek,
  getHighlightsForMonth,
  getHighlightsForYear,
  getHighlightsInRange,
  searchHighlights,
  getHighlightsByCategory,
  getTodaysHighlights,
  listAllHighlights
} from './utils';
