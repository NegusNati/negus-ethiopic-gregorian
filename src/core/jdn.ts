/* Julian Day Number helpers (integer math).  */

import type { GregorianDate, WeekdayIndex } from '../types';

/** Gregorian → JDN (valid for all proleptic Gregorian dates). */
export function gregorianToJdn(y: number, m: number, d: number): number {
  const a = Math.trunc((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.trunc((153 * mm + 2) / 5) +
    365 * yy +
    Math.trunc(yy / 4) -
    Math.trunc(yy / 100) +
    Math.trunc(yy / 400) -
    32045
  );
}

/** JDN → Gregorian (proleptic). */
export function jdnToGregorian(jdn: number): GregorianDate {
  const a = jdn + 32044;
  const b = Math.trunc((4 * a + 3) / 146097);
  const c = a - Math.trunc((146097 * b) / 4);
  const d = Math.trunc((4 * c + 3) / 1461);
  const e = c - Math.trunc((1461 * d) / 4);
  const m = Math.trunc((5 * e + 2) / 153);

  const day = e - Math.trunc((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.trunc(m / 10);
  const year = 100 * b + d - 4800 + Math.trunc(m / 10);

  return { year, month, day };
}

/** 0=Sunday..6=Saturday; derived from JDN modulo 7. */
export function weekdayFromJdn(jdn: number): WeekdayIndex {
  const w = (jdn + 1) % 7; // USNO convention
  return (w < 0 ? (w + 7) : w) as WeekdayIndex;
}