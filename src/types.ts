export type Calendar = 'ethiopic' | 'gregorian';
export type Era = 'AM' | 'AA'; // Amete Mihret (default) or Amete Alem

export interface EthiopicDate {
  year: number;   // >= 1 (AM). For AA, use era field.
  month: number;  // 1..13
  day: number;    // 1..30 (or 1..5/6 for Pagume)
  era?: Era;      // default 'AM'
}

export interface GregorianDate {
  year: number;   // e.g., 2025
  month: number;  // 1..12
  day: number;    // 1..31
}

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday

export interface YearProgress {
  daysLeft: number;         // integer days until next 1/1 (or Meskerem 1)
  totalDaysInYear: number;  // 365 or 366
  percentCompleted: number; // 0..100 (to 2 decimals)
}