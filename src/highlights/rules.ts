import type { GregorianDate } from '../types';
import { gregorianToJdn, jdnToGregorian, weekdayFromJdn } from '../core/jdn';
import { toGregorian } from '../core/ethiopic';

// Dynamic holiday rule interface (Gregorian-based for computation)
export interface DynamicGregorianRule {
  id: string;
  name: string;
  amharicName: string;
  category?: 'religious' | 'national' | 'observance';
  tags?: string[];
  // Return all Gregorian month/day occurrences for the given Gregorian year
  occurrences: (_year: number) => { month: number; day: number }[];
}

// (helpers removed; not needed)

// Orthodox Easter (used by Ethiopian Fasika) – algorithm produces Gregorian Easter Sunday for Orthodox churches
export function orthodoxEasterGregorian(year: number): GregorianDate {
  // Meeus algorithm (Julian calendar) for Orthodox Easter
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const monthJulian = Math.trunc((d + e + 114) / 31); // 3=Mar, 4=Apr (Julian)
  const dayJulian = ((d + e + 114) % 31) + 1;

  // Convert the Julian calendar date to JDN, then to Gregorian exactly (works for any century)
  const jdn = julianToJdn(year, monthJulian, dayJulian);
  return jdnToGregorian(jdn);
}

// Julian calendar → JDN (proleptic). Avoids century-specific deltas.
function julianToJdn(y: number, m: number, d: number): number {
  const a = Math.trunc((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.trunc((153 * mm + 2) / 5) + 365 * yy + Math.trunc(yy / 4) - 32083;
}

export function goodFridayGregorian(year: number): GregorianDate {
  const easter = orthodoxEasterGregorian(year);
  const j = gregorianToJdn(easter.year, easter.month, easter.day);
  return jdnToGregorian(j - 2);
}

function firstWeekdayOfGregorianMonth(year: number, month: number, weekday: number): GregorianDate {
  const startJdn = gregorianToJdn(year, month, 1);
  const startWeekday = weekdayFromJdn(startJdn);
  const offset = (weekday - startWeekday + 7) % 7;
  return jdnToGregorian(startJdn + offset);
}

// Ethiopian National Flag Day - First Monday of Tikimt
export function ethiopianFlagDayGregorian(year: number): GregorianDate {
  // Tikimt (month 2) typically starts around October 11 in the Gregorian calendar
  // The Ethiopian year is about 7-8 years behind the Gregorian year
  // For a given Gregorian year, we need to find the Ethiopian year where Tikimt falls
  
  const candidateEthiopianYears = [year - 8, year - 7, year - 6]; // Cast a wider net for safety
  
  for (const ethiopianYear of candidateEthiopianYears) {
    // Start of Tikimt (month 2, day 1) in Ethiopian calendar
    const tikimtStart = { year: ethiopianYear, month: 2, day: 1, era: 'AM' as const };
    
    // Convert to Gregorian
    const tikimtStartGregorian = toGregorian(tikimtStart);
    
    // Check if this Tikimt start falls in the requested Gregorian year
    if (tikimtStartGregorian.year === year) {
      const tikimtStartJdn = gregorianToJdn(tikimtStartGregorian.year, tikimtStartGregorian.month, tikimtStartGregorian.day);
      const startWeekday = weekdayFromJdn(tikimtStartJdn); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      // Calculate days to add to get to the first Monday
      const daysToFirstMonday = startWeekday === 1 ? 0 : (1 - startWeekday + 7) % 7;
      const firstMondayJdn = tikimtStartJdn + daysToFirstMonday;
      return jdnToGregorian(firstMondayJdn);
    }
  }
  
  // If no match found, return null - this allows the occurrence function to return empty array
  throw new Error(`Could not calculate Ethiopian Flag Day for Gregorian year ${year}`);
}
export function hosannaGregorian(year: number): GregorianDate {
  const easter = orthodoxEasterGregorian(year);
  const j = gregorianToJdn(easter.year, easter.month, easter.day);
  return jdnToGregorian(j - 7); // Palm Sunday (Hosanna): one week before Easter
}

//
// Tabular Islamic calendar (civil) converters – adequate for highlight purposes
// Epoch: Friday, 16 July 622 (Julian) ≈ JDN 1948439
//
const ISLAMIC_EPOCH = 1948439;

function islamicToJdn(iy: number, im: number, id: number): number {
  // Using the arithmetic (tabular) calendar; months alternate 30/29 starting with Muharram=1 (30)
  const monthDays = Math.ceil(29.5 * (im - 1));
  const yearDays = (iy - 1) * 354 + Math.floor((3 + 11 * iy) / 30);
  return ISLAMIC_EPOCH + yearDays + monthDays + id - 1;
}

// Rough heuristic to guess Islamic year for a Gregorian year
function approxIslamicYearForGregorianYear(gy: number): number {
  return Math.floor((gy - 622) * 33 / 32);
}

function islamicOccurrencesInGregorianYear(gy: number, im: number, id: number): { month: number; day: number }[] {
  const iy0 = approxIslamicYearForGregorianYear(gy);
  const candidates: { month: number; day: number }[] = [];
  for (let iy = iy0 - 1; iy <= iy0 + 2; iy++) {
    const j = islamicToJdn(iy, im, id);
    const g = jdnToGregorian(j);
    if (g.year === gy) candidates.push({ month: g.month, day: g.day });
  }
  return candidates;
}

// Dynamic rules available to the utilities
export const DYNAMIC_GREGORIAN_HIGHLIGHTS: DynamicGregorianRule[] = [
  {
    id: 'fasika',
    name: 'Ethiopian Easter (Fasika)',
    amharicName: 'ፋሲካ',
    category: 'religious', tags: ['christian', 'orthodox', 'ethiopia', 'public-holiday'],
    occurrences: (gy) => {
      const e = orthodoxEasterGregorian(gy);
      return [{ month: e.month, day: e.day }];
    }
  },
  {
    id: 'good_friday',
    name: 'Good Friday (Orthodox/Ethiopian)',
    amharicName: 'ስቅለት ዓርብ',
    category: 'religious', tags: ['christian', 'orthodox', 'public-holiday'],
    occurrences: (gy) => {
      const g = goodFridayGregorian(gy);
      return [{ month: g.month, day: g.day }];
    }
  },
  {
    id: 'hosanna',
    name: 'Hosanna (Palm Sunday)',
    amharicName: 'ሆሳና',
    category: 'religious', tags: ['christian', 'orthodox'],
    occurrences: (gy) => {
      const g = hosannaGregorian(gy);
      return [{ month: g.month, day: g.day }];
    }
  },
  {
    id: 'eid_al_fitr',
    name: 'Eid al-Fitr',
    amharicName: 'ኢድ አል-ፊትር',
    category: 'religious', tags: ['muslim', 'islamic', 'public-holiday'],
    occurrences: (gy) => islamicOccurrencesInGregorianYear(gy, 10, 1) // 1 Shawwal
  },
  {
    id: 'eid_al_adha',
    name: 'Eid al-Adha',
    amharicName: 'ኢድ አል-አድሐ',
    category: 'religious', tags: ['muslim', 'islamic', 'public-holiday'],
    occurrences: (gy) => islamicOccurrencesInGregorianYear(gy, 12, 10) // 10 Dhu al-Hijjah
  },
  {
    id: 'mawlid',
    name: "Mawlid (Prophet's Birthday)",
    amharicName: 'መውሊድ',
    category: 'religious', tags: ['muslim', 'islamic', 'public-holiday'],
    occurrences: (gy) => islamicOccurrencesInGregorianYear(gy, 3, 12) // 12 Rabi' al-awwal
  },
  {
    id: 'irreechaa_finfinne',
    name: 'Irreechaa at Hora Finfinne',
    amharicName: 'ኢርሪቻ (ሆራ ፊንፊኔ)',
    category: 'observance', tags: ['ethiopia', 'oromo', 'culture', 'thanksgiving'],
    occurrences: (gy) => {
      const firstSaturday = firstWeekdayOfGregorianMonth(gy, 10, 6);
      return [{ month: firstSaturday.month, day: firstSaturday.day }];
    }
  },
  {
    id: 'irreechaa_bishoftu',
    name: 'Irreechaa at Hora Harsede',
    amharicName: 'ኢርሪቻ (ሆራ ሐርሴዴ)',
    category: 'observance', tags: ['ethiopia', 'oromo', 'culture', 'thanksgiving'],
    occurrences: (gy) => {
      const firstSaturday = firstWeekdayOfGregorianMonth(gy, 10, 6);
      const saturdayJdn = gregorianToJdn(gy, firstSaturday.month, firstSaturday.day);
      const sunday = jdnToGregorian(saturdayJdn + 1);
      return [{ month: sunday.month, day: sunday.day }];
    }
  },
  {
    id: 'ethiopian_flag_day',
    name: 'Ethiopian National Flag Day',
    amharicName: 'የኢትዮጵያ ብሔራዊ ሰንደቅ ዓላማ ቀን',
    category: 'national', tags: ['ethiopia', 'flag', 'national-day'],
    occurrences: (gy) => {
      try {
        const flagDay = ethiopianFlagDayGregorian(gy);
        return [{ month: flagDay.month, day: flagDay.day }];
      } catch {
        // If calculation fails, return empty array (no occurrence this year)
        return [];
      }
    }
  }
];
