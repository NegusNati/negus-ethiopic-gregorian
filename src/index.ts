export type { Calendar, Era, EthiopicDate, GregorianDate, YearProgress, WeekdayIndex } from './types';

// Core conversions
export {
  ETH_EPOCH,
  AMETE_MIHRET_DELTA,
  toGregorian,
  toEthiopic,
  isEthiopicLeapYear,
  ethiopicDaysInMonth,
  ethiopicToJdn,
  jdnToEthiopic
} from './core/ethiopic';

export {
  isGregorianLeapYear,
  gregorianDaysInMonth
} from './core/gregorian';

export {
  gregorianToJdn,
  jdnToGregorian,
  weekdayFromJdn
} from './core/jdn';

// Utilities
export {
  today,
  addDays, addMonths, addYears,
  previousDay, nextDay,
  lastWeek, nextWeek, lastMonth, nextMonth, lastYear, nextYear, lastCentury, nextCentury,
  yearProgress
} from './utils/arithmetic';

// Highlights (with utility functions for easy access)
export {
  ETHIOPIAN_HIGHLIGHTS,
  GREGORIAN_HIGHLIGHTS,
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
  listAllHighlights,
  type Highlight,
  type HighlightWithDate,
  type ResolvedHighlight,
  type HighlightCategory
} from './highlights';
