import type { Calendar, EthiopicDate, GregorianDate } from '../types';
import type { Highlight, HighlightWithDate, ResolvedHighlight } from './types';
// Avoid circular imports by importing concrete lists directly
import { ETHIOPIAN_HIGHLIGHTS } from './ethiopian';
import { GREGORIAN_HIGHLIGHTS } from './gregorian';
import { DYNAMIC_GREGORIAN_HIGHLIGHTS } from './rules';
import { toGregorian, toEthiopic } from '../core/ethiopic';
import { gregorianToJdn, jdnToGregorian, weekdayFromJdn } from '../core/jdn';
import { addDays } from '../utils/arithmetic';

// Canonical id mapping to dedupe cross-calendar duplicates
const CANONICAL: Record<string, string> = {
  meskel_g: 'meskel',
  genna_g: 'genna',
  adwa_e: 'adwa',
  patriots_e: 'patriots',
  derg_e: 'derg',
};
const canonicalId = (id: string) => CANONICAL[id] ?? id;

/**
 * Get all highlights for a specific day in either calendar
 */
export function getHighlightsForDay(
  date: EthiopicDate | GregorianDate,
  calendar: Calendar
): Highlight[] {
  if (calendar === 'gregorian') {
    return getHighlightsForGregorianDay(date as GregorianDate);
  }
  return getHighlightsForEthiopicDay(date as EthiopicDate);
}

/**
 * Get all highlights for a specific Gregorian date
 */
export function getHighlightsForGregorianDay(date: GregorianDate): Highlight[] {
  const fixed = GREGORIAN_HIGHLIGHTS.filter(highlight =>
    highlight.calendar === 'gregorian' &&
    highlight.month === date.month &&
    highlight.day === date.day
  );

  // Dynamic rules (e.g., Fasika/Eid/Mawlid) computed per Gregorian year
  const dynamic = DYNAMIC_GREGORIAN_HIGHLIGHTS.flatMap(rule => {
    const hits = rule.occurrences(date.year).filter(d => d.month === date.month && d.day === date.day);
    return hits.map(d => ({ id: rule.id, name: rule.name, amharicName: rule.amharicName, calendar: 'gregorian' as const, month: d.month, day: d.day } satisfies Highlight));
  });

  return [...fixed, ...dynamic];
}

/**
 * Get all highlights for a specific Ethiopic date
 */
export function getHighlightsForEthiopicDay(date: EthiopicDate): Highlight[] {
  const fixed = ETHIOPIAN_HIGHLIGHTS.filter(highlight =>
    highlight.calendar === 'ethiopic' &&
    highlight.month === date.month &&
    highlight.day === date.day
  );

  // Also include any dynamic Gregorian-based highlights that convert to this Ethiopic date
  // We check around the overlapping Gregorian years for safety
  const g = toGregorian(date);
  const candidateYears = new Set([g.year - 1, g.year, g.year + 1]);
  const dynamic = Array.from(candidateYears).flatMap(y =>
    DYNAMIC_GREGORIAN_HIGHLIGHTS.flatMap(rule =>
      rule.occurrences(y).map(d => ({ year: y, ...d }))
    )
  ).flatMap(({ year, month, day }) => {
    const e = toEthiopic({ year, month, day });
    if (e.year === date.year && e.month === date.month && e.day === date.day) {
      // Find the rule for the names
      const rule = DYNAMIC_GREGORIAN_HIGHLIGHTS.find(r =>
        r.occurrences(year).some(d => d.month === month && d.day === day)
      );
      if (rule) {
        return [{ id: rule.id, name: rule.name, amharicName: rule.amharicName, calendar: 'ethiopic' as const, month: date.month, day: date.day } satisfies Highlight];
      }
    }
    return [] as Highlight[];
  });

  return [...fixed, ...dynamic];
}

/**
 * Get all highlights for a week (7 days) starting from the given date
 */
export function getHighlightsForWeek(
  startDate: EthiopicDate | GregorianDate,
  calendar: Calendar,
  includeWeekends: boolean = true
): HighlightWithDate[] {
  const highlights: HighlightWithDate[] = [];

  // Get highlights for each day of the week
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(startDate, i, calendar);
    const currentGregorian = calendar === 'gregorian'
      ? (currentDate as GregorianDate)
      : toGregorian(currentDate as EthiopicDate);

    if (!includeWeekends) {
      const w = weekdayFromJdn(gregorianToJdn(currentGregorian.year, currentGregorian.month, currentGregorian.day));
      // 0 = Sunday, 6 = Saturday
      if (w === 0 || w === 6) continue;
    }

    const dayHighlights = calendar === 'gregorian'
      ? getHighlightsForGregorianDay(currentDate as GregorianDate)
      : getHighlightsForEthiopicDay(currentDate as EthiopicDate);

    dayHighlights.forEach(highlight => {
      highlights.push({
        ...highlight,
        date: new Date(currentGregorian.year, currentGregorian.month - 1, currentGregorian.day)
      });
    });
  }

  return highlights;
}

/**
 * Get all highlights for a month
 */
export function getHighlightsForMonth(
  year: number,
  month: number,
  calendar: Calendar
): Highlight[] {
  if (calendar === 'gregorian') {
    const fixed = GREGORIAN_HIGHLIGHTS.filter(highlight =>
      highlight.calendar === 'gregorian' && highlight.month === month
    );
    const dynamic = DYNAMIC_GREGORIAN_HIGHLIGHTS.flatMap(rule =>
      rule.occurrences(year)
        .filter(d => d.month === month)
        .map(d => ({ id: rule.id, name: rule.name, amharicName: rule.amharicName, calendar: 'gregorian' as const, month: d.month, day: d.day } satisfies Highlight))
    );
    return [...fixed, ...dynamic];
  } else {
    const fixed = ETHIOPIAN_HIGHLIGHTS.filter(highlight =>
      highlight.calendar === 'ethiopic' && highlight.month === month
    );
    // Compute Gregorian dynamics and convert to Ethiopic year
    const startOfMonthG = toGregorian({ year, month, day: 1, era: 'AM' });
    const candidateYears = new Set([startOfMonthG.year - 1, startOfMonthG.year, startOfMonthG.year + 1]);
    const dynamic = Array.from(candidateYears).flatMap(y =>
      DYNAMIC_GREGORIAN_HIGHLIGHTS.flatMap(rule =>
        rule.occurrences(y).map(d => ({ year: y, ...d }))
      )
    ).flatMap(({ year: gy, month: gm, day: gd }) => {
      const e = toEthiopic({ year: gy, month: gm, day: gd });
      if (e.year === year && e.month === month) {
        const rule = DYNAMIC_GREGORIAN_HIGHLIGHTS.find(r => r.occurrences(gy).some(d => d.month === gm && d.day === gd));
        if (rule) {
          return [{ id: rule.id, name: rule.name, amharicName: rule.amharicName, calendar: 'ethiopic' as const, month: e.month, day: e.day } satisfies Highlight];
        }
      }
      return [] as Highlight[];
    });
    return [...fixed, ...dynamic];
  }
}

/**
 * Get all highlights for a specific year
 */
export function getHighlightsForYear(year: number, calendar: Calendar): Highlight[] {
  if (calendar === 'gregorian') {
    const fixed = GREGORIAN_HIGHLIGHTS.filter(highlight => highlight.calendar === 'gregorian');
    const dynamic = DYNAMIC_GREGORIAN_HIGHLIGHTS.flatMap(rule =>
      rule.occurrences(year).map(d => ({ id: rule.id, name: rule.name, amharicName: rule.amharicName, calendar: 'gregorian' as const, month: d.month, day: d.day } satisfies Highlight))
    );
    return [...fixed, ...dynamic];
  } else {
    const fixed = ETHIOPIAN_HIGHLIGHTS.filter(highlight => highlight.calendar === 'ethiopic');
    // Include dynamic: convert Gregorian occurrences overlapping the Ethiopic year
    const startOfYearG = toGregorian({ year, month: 1, day: 1, era: 'AM' });
    const endOfYearG = toGregorian({ year, month: 13, day: 5, era: 'AM' });
    const candidateYears = new Set([startOfYearG.year - 1, startOfYearG.year, startOfYearG.year + 1, endOfYearG.year]);
    const dynamic = Array.from(candidateYears).flatMap(gy =>
      DYNAMIC_GREGORIAN_HIGHLIGHTS.flatMap(rule =>
        rule.occurrences(gy).map(d => ({ year: gy, ...d, rule }))
      )
    ).map(({ year: gy, month: gm, day: gd, rule }) => {
      const e = toEthiopic({ year: gy, month: gm, day: gd });
      if (e.year === year) {
        return { id: rule.id, name: rule.name, amharicName: rule.amharicName, calendar: 'ethiopic' as const, month: e.month, day: e.day } as Highlight;
      }
      return undefined as unknown as Highlight;
    });
    return [...fixed, ...dynamic.filter(Boolean)];
  }
}

/**
 * Get all highlights between two dates
 */
export function getHighlightsInRange(
  startDate: EthiopicDate | GregorianDate,
  endDate: EthiopicDate | GregorianDate,
  calendar: Calendar
): HighlightWithDate[] {
  const highlights: HighlightWithDate[] = [];

  // Calculate number of days between dates
  const endGregorian = calendar === 'ethiopic'
    ? toGregorian(endDate as EthiopicDate)
    : endDate as GregorianDate;
  const startGregorian = calendar === 'ethiopic'
    ? toGregorian(startDate as EthiopicDate)
    : startDate as GregorianDate;

  const startJdn = gregorianToJdn(startGregorian.year, startGregorian.month, startGregorian.day);
  const endJdn = gregorianToJdn(endGregorian.year, endGregorian.month, endGregorian.day);

  for (let jdn = startJdn; jdn <= endJdn; jdn++) {
    const currentGregorian = jdnToGregorian(jdn);
    const dayHighlights = getHighlightsForGregorianDay(currentGregorian);

    dayHighlights.forEach(highlight => {
      highlights.push({
        ...highlight,
        date: new Date(currentGregorian.year, currentGregorian.month - 1, currentGregorian.day)
      });
    });
  }

  return highlights;
}

/**
 * Search highlights by name (English or Amharic)
 */
export function searchHighlights(query: string): Highlight[] {
  // Include fixed highlights and dynamic (for the current UTC Gregorian year)
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const dynamic: Highlight[] = DYNAMIC_GREGORIAN_HIGHLIGHTS.flatMap(rule =>
    rule.occurrences(currentYear).map(d => ({
      id: rule.id,
      name: rule.name,
      amharicName: rule.amharicName,
      calendar: 'gregorian' as const,
      month: d.month,
      day: d.day
    }))
  );

  const allHighlights = [...ETHIOPIAN_HIGHLIGHTS, ...GREGORIAN_HIGHLIGHTS, ...dynamic];
  const lowerQuery = query.toLowerCase();

  return allHighlights.filter(highlight =>
    highlight.name.toLowerCase().includes(lowerQuery) ||
    highlight.amharicName.includes(query)
  );
}

/**
 * Get highlights by category/type (if more detailed categorization is added later)
 */
export function getHighlightsByCategory(category: string): Highlight[] {
  const allHighlights = [...ETHIOPIAN_HIGHLIGHTS, ...GREGORIAN_HIGHLIGHTS];

  // For now, this is a placeholder - could be expanded based on highlight metadata
  return allHighlights.filter(highlight =>
    highlight.name.toLowerCase().includes(category.toLowerCase()) ||
    highlight.amharicName.includes(category)
  );
}

/**
 * Get today's highlights
 */
export function getTodaysHighlights(): HighlightWithDate[] {
  const today = new Date();
  const todayGregorian: GregorianDate = {
    year: today.getUTCFullYear(),
    month: today.getUTCMonth() + 1,
    day: today.getUTCDate()
  };

  const highlights = getHighlightsForGregorianDay(todayGregorian);

  return highlights.map(highlight => ({
    ...highlight,
    date: today
  }));
}

/**
 * List all highlights for a given year with both calendar counterparts.
 * - calendar decides the year boundary to use (gregorian vs ethiopic)
 * - results are deduped by canonical id + exact occurrence date
 * - sorted by the requested calendar's chronology
 */
export function listAllHighlights(year: number, calendar: Calendar): ResolvedHighlight[] {
  type Base = Pick<Highlight, 'id' | 'name' | 'amharicName' | 'category' | 'tags'>;
  const items: { base: Base; g: GregorianDate; e: EthiopicDate }[] = [];

  const push = (base: Base, g: GregorianDate) => {
    const e = toEthiopic(g);
    items.push({ base: { ...base, id: canonicalId(base.id) }, g, e });
  };

  if (calendar === 'gregorian') {
    // Fixed Gregorian
    for (const h of GREGORIAN_HIGHLIGHTS) {
      push(h, { year, month: h.month, day: h.day });
    }
    // Dynamic Gregorian
    for (const rule of DYNAMIC_GREGORIAN_HIGHLIGHTS) {
      for (const d of rule.occurrences(year)) {
        push(rule, { year, month: d.month, day: d.day });
      }
    }
    // Ethiopic fixed converted if they fall in this Gregorian year
    const eyStart = toEthiopic({ year, month: 1, day: 1 });
    const eyEnd = toEthiopic({ year, month: 12, day: 31 });
    const eYears = new Set([eyStart.year - 1, eyStart.year, eyEnd.year, eyStart.year + 1]);
    for (const ey of eYears) {
      for (const h of ETHIOPIAN_HIGHLIGHTS) {
        const g = toGregorian({ year: ey, month: h.month, day: h.day, era: 'AM' });
        if (g.year === year) push(h, g);
      }
    }
  } else {
    // Ethiopic fixed
    for (const h of ETHIOPIAN_HIGHLIGHTS) {
      const g = toGregorian({ year, month: h.month, day: h.day, era: 'AM' });
      push(h, g);
    }
    // Gregorian fixed converted if they fall in this Ethiopic year
    const gStart = toGregorian({ year, month: 1, day: 1, era: 'AM' });
    const gEnd = toGregorian({ year, month: 13, day: 5, era: 'AM' });
    const gYears = new Set([gStart.year - 1, gStart.year, gEnd.year, gStart.year + 1]);
    for (const gy of gYears) {
      for (const h of GREGORIAN_HIGHLIGHTS) {
        const e = toEthiopic({ year: gy, month: h.month, day: h.day });
        if (e.year === year) push(h, { year: gy, month: h.month, day: h.day });
      }
    }
    // Dynamic Gregorian converted if they fall in this Ethiopic year
    for (const gy of gYears) {
      for (const rule of DYNAMIC_GREGORIAN_HIGHLIGHTS) {
        for (const d of rule.occurrences(gy)) {
          const e = toEthiopic({ year: gy, month: d.month, day: d.day });
          if (e.year === year) push(rule, { year: gy, month: d.month, day: d.day });
        }
      }
    }
  }

  // Deduplicate by canonical id + Gregorian date
  const seen = new Map<string, { base: Base; g: GregorianDate; e: EthiopicDate }>();
  for (const it of items) {
    const key = `${canonicalId(it.base.id)}:${it.g.year}-${it.g.month}-${it.g.day}`;
    if (!seen.has(key)) {
      seen.set(key, it);
    } else {
      // merge tags/category if needed
      const prev = seen.get(key)!;
      const tags = Array.from(new Set([...(prev.base.tags ?? []), ...(it.base.tags ?? [])]));
      const category = prev.base.category ?? it.base.category;
      seen.set(key, {
        ...prev,
        base: {
          ...prev.base,
          ...(category && { category }),
          tags
        }
      });
    }
  }

  const resolved: ResolvedHighlight[] = Array.from(seen.values()).map(({ base, g, e }) => ({
    id: canonicalId(base.id),
    name: base.name,
    amharicName: base.amharicName,
    ...(base.category && { category: base.category }),
    ...(base.tags && base.tags.length > 0 && { tags: base.tags }),
    gregorian: g,
    ethiopic: { ...e, era: 'AM' },
  }));

  const keyJdn = (g: GregorianDate) => gregorianToJdn(g.year, g.month, g.day);
  resolved.sort((a, b) => keyJdn(a.gregorian) - keyJdn(b.gregorian));
  return resolved;
}
