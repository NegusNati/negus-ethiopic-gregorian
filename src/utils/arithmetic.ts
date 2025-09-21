import type { Calendar, EthiopicDate, GregorianDate, YearProgress } from '../types';
import { gregorianDaysInMonth } from '../core/gregorian';
import { ethiopicDaysInMonth, ethiopicToJdn, jdnToEthiopic, toEthiopic } from '../core/ethiopic';
import { gregorianToJdn, jdnToGregorian } from '../core/jdn';
import { isGregorianLeapYear } from '../core/gregorian';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Get today's date in UTC as Gregorian or Ethiopic (no timezones). */
export function today(calendar: Calendar = 'gregorian'): EthiopicDate | GregorianDate {
  const now = new Date();
  const g: GregorianDate = { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1, day: now.getUTCDate() };
  return calendar === 'gregorian' ? g : toEthiopic(g);
}

/** Add days via JDN for perfect cross-month/year arithmetic. */
export function addDays<T extends EthiopicDate | GregorianDate>(date: T, days: number, calendar: Calendar): T {
  const jdn = calendar === 'gregorian'
    ? gregorianToJdn((date as GregorianDate).year, (date as GregorianDate).month, (date as GregorianDate).day)
    : ethiopicToJdn((date as EthiopicDate).year, (date as EthiopicDate).month, (date as EthiopicDate).day, (date as EthiopicDate).era ?? 'AM');

  const j = jdn + days;
  return (calendar === 'gregorian'
    ? (jdnToGregorian(j) as T)
    : ({ ...jdnToEthiopic(j), era: 'AM' } as T));
}

/** Add months respecting calendar-specific month lengths. */
export function addMonths<T extends EthiopicDate | GregorianDate>(date: T, months: number, calendar: Calendar): T {
  if (calendar === 'gregorian') {
    const { year, month, day } = date as GregorianDate;
    const m0 = month - 1 + months;
    const y2 = year + Math.trunc(m0 / 12);
    const m2 = ((m0 % 12) + 12) % 12 + 1;
    const d2 = clamp(day, 1, gregorianDaysInMonth(y2, m2));
    return { year: y2, month: m2, day: d2 } as T;
  }
  // Ethiopic calendar: treat months as 13-per-year and clamp overflow (Pagume days into Meskerem)
  const { year, month, day, era } = date as EthiopicDate;
  const amEra = era ?? 'AM';

  // Compute target year/month by linearizing months into 13-month years
  const total = (year - 1) * 13 + (month - 1) + months;
  const y2 = Math.floor(total / 13) + 1;
  const m2 = ((total % 13) + 13) % 13 + 1;
  const max = ethiopicDaysInMonth(y2, m2, amEra);
  const d2 = day > max ? max : day;
  return { year: y2, month: m2, day: d2, era: amEra } as T;
}

/** Add years with clamping (e.g., Feb 29 → Feb 28 when needed). */
export function addYears<T extends EthiopicDate | GregorianDate>(date: T, years: number, calendar: Calendar): T {
  if (calendar === 'gregorian') {
    const { year, month, day } = date as GregorianDate;
    const y2 = year + years;
    const d2 = month === 2 && day === 29 && !isGregorianLeapYear(y2) ? 28 : day;
    return { year: y2, month, day: d2 } as T;
  }
  const { year, month, day, era } = date as EthiopicDate;
  const y2 = year + years;
  const max = ethiopicDaysInMonth(y2, month, era ?? 'AM');
  const d2 = day > max ? max : day;
  return { year: y2, month, day: d2, era: era ?? 'AM' } as T;
}

/** Syntactic sugar utilities. */
export const previousDay  = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addDays(d, -1, cal);
export const nextDay      = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addDays(d, +1, cal);
export const lastWeek     = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addDays(d, -7, cal);
export const nextWeek     = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addDays(d, +7, cal);
export const lastMonth    = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addMonths(d, -1, cal);
export const nextMonth    = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addMonths(d, +1, cal);
export const lastYear     = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addYears(d, -1, cal);
export const nextYear     = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addYears(d, +1, cal);
export const lastCentury  = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addYears(d, -100, cal);
export const nextCentury  = <T extends EthiopicDate | GregorianDate>(d: T, cal: Calendar) => addYears(d, +100, cal);

/** Days until next 1/1 (or Meskerem 1), and % of year completed. */
export function yearProgress(date: EthiopicDate | GregorianDate, calendar: Calendar): YearProgress {
  if (calendar === 'gregorian') {
    const g = date as GregorianDate;
    const start = gregorianToJdn(g.year, 1, 1);
    const endNextStart = gregorianToJdn(g.year + 1, 1, 1);
    const jdn = gregorianToJdn(g.year, g.month, g.day);
    const total = endNextStart - start; // 365/366
    const daysLeft = endNextStart - jdn;
    const percentCompleted = Math.max(0, Math.min(100, ((jdn - start) / total) * 100));
    return { daysLeft, totalDaysInYear: total, percentCompleted: +percentCompleted.toFixed(2) };
  }
  const e = date as EthiopicDate;
  const start = ethiopicToJdn(e.year, 1, 1, e.era ?? 'AM');
  const endNextStart = ethiopicToJdn(e.year + 1, 1, 1, e.era ?? 'AM');
  const jdn = ethiopicToJdn(e.year, e.month, e.day, e.era ?? 'AM');
  const total = endNextStart - start;
  const daysLeft = endNextStart - jdn;
  const percentCompleted = Math.max(0, Math.min(100, ((jdn - start) / total) * 100));
  return { daysLeft, totalDaysInYear: total, percentCompleted: +percentCompleted.toFixed(2) };
}
