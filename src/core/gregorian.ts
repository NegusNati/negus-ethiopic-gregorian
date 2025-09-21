import type { GregorianDate } from '../types';
import { gregorianToJdn, jdnToGregorian } from './jdn';

export const isGregorianLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

export function gregorianDaysInMonth(year: number, month: number): number {
  if (month === 2) return isGregorianLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  if (month >= 1 && month <= 12) return 31;
  throw new RangeError(`Invalid Gregorian month: ${month}`);
}

export const toJdn = (d: GregorianDate) => gregorianToJdn(d.year, d.month, d.day);
export const fromJdn = (jdn: number) => jdnToGregorian(jdn);