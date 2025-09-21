import type { Calendar, EthiopicDate, GregorianDate } from '../types';

export type HighlightCategory = 'religious' | 'national' | 'observance';

export interface Highlight {
  id: string;
  name: string;        // English name
  amharicName: string; // Amharic name
  calendar: Calendar;  // which calendar the rule is defined in
  month: number;
  day: number;
  category?: HighlightCategory; // e.g., 'religious' | 'national' | 'observance'
  tags?: string[];              // further descriptors: 'orthodox', 'christian', 'muslim', 'islamic', 'ethiopia', ...
}

export interface HighlightWithDate extends Highlight {
  date: Date; // Optional date object for easier manipulation
}

/** Fully resolved highlight with both calendar counterparts. */
export interface ResolvedHighlight {
  id: string;                 // canonical id after dedupe
  name: string;
  amharicName: string;
  category?: HighlightCategory;
  tags?: string[];
  gregorian: GregorianDate;   // Gregorian occurrence in the requested year
  ethiopic: EthiopicDate;     // Ethiopic counterpart for the same occurrence
}
