import type { EthiopicDate, GregorianDate, Era } from '../types';
import { gregorianToJdn, jdnToGregorian } from './jdn';

/** Ethiopic epoch (1 Meskerem 1 AM == 8-08-29 (Julian)). */
export const ETH_EPOCH = 1723856; // well-established constant

/** AM ↔ AA delta: AA 5501 = AM 1 */
export const AMETE_MIHRET_DELTA = 5500;

const div = (a: number, b: number) => Math.trunc(a / b);
const mod = (a: number, b: number) => a - b * Math.trunc(a / b);

export function normalizeAmYear(year: number, era: Era = 'AM'): number {
  return era === 'AA' ? year - AMETE_MIHRET_DELTA : year;
}

/** Ethiopic leap year: year % 4 === 3 (Amete Mihret numbering). */
export function isEthiopicLeapYear(year: number, era: Era = 'AM'): boolean {
  const amYear = normalizeAmYear(year, era);
  return amYear % 4 === 3;
}

/** Days in Ethiopic month. */
export function ethiopicDaysInMonth(year: number, month: number, era: Era = 'AM'): number {
  if (month >= 1 && month <= 12) return 30;
  if (month === 13) return isEthiopicLeapYear(year, era) ? 6 : 5;
  throw new RangeError(`Invalid Ethiopic month: ${month}`);
}

/** Ethiopic → JDN (AM numbering by default). */
export function ethiopicToJdn(year: number, month: number, day: number, era: Era = 'AM'): number {
  const amYear = normalizeAmYear(year, era);
  // Formula consistent with widely used implementations (ceil-free integer math).
  return ETH_EPOCH + 365 * amYear + div(amYear, 4) + 30 * month + day - 31;
}

/** JDN → Ethiopic (AM numbering). */
export function jdnToEthiopic(jdn: number): { year: number; month: number; day: number } {
  const r = mod(jdn - ETH_EPOCH, 1461);
  const n = mod(r, 365) + 365 * div(r, 1460);
  const year = 4 * div(jdn - ETH_EPOCH, 1461) + div(r, 365) - div(r, 1460);
  const month = div(n, 30) + 1;
  const day = mod(n, 30) + 1;
  return { year, month, day };
}

/** Ethiopian → Gregorian. */
export function toGregorian(ed: EthiopicDate): GregorianDate {
  const jdn = ethiopicToJdn(ed.year, ed.month, ed.day, ed.era ?? 'AM');
  return jdnToGregorian(jdn);
}

/** Gregorian → Ethiopian (AM). */
export function toEthiopic(gd: GregorianDate): EthiopicDate {
  const jdn = gregorianToJdn(gd.year, gd.month, gd.day);
  const e = jdnToEthiopic(jdn);
  return { ...e, era: 'AM' };
}