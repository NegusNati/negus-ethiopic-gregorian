import type { Highlight } from './types';

/** Fixed Ethiopic dates (AM). Extend freely later. */
export const ETHIOPIAN_HIGHLIGHTS: Highlight[] = [
  { id: 'enkutatash', name: 'Ethiopian New Year (Enkutatash)', amharicName: 'እንቁጣጣሽ (ኢትዮጵያ አዲስ ዓመት)', calendar: 'ethiopic', month: 1, day: 1,  category: 'national', tags: ['ethiopia', 'new-year', 'public-holiday'] },
  { id: 'demera',     name: 'Demera (Meskel Eve)', amharicName: 'ደመራ (መስቀል ዋዜማ)', calendar: 'ethiopic', month: 1, day: 16, category: 'religious', tags: ['christian', 'orthodox'] },
  { id: 'meskel',     name: 'Meskel (Finding of the True Cross)', amharicName: 'መስቀል (የእውነተኛው መስቀል ማግኘት)', calendar: 'ethiopic', month: 1, day: 17, category: 'religious', tags: ['christian', 'orthodox', 'ethiopia', 'public-holiday'] },
  { id: 'ketera',     name: 'Ketera (Timkat Eve)', amharicName: 'ቀጤራ (የጥምቀት ዋዜማ)', calendar: 'ethiopic', month: 5, day: 10, category: 'religious', tags: ['christian', 'orthodox'] },
  { id: 'timkat',     name: 'Timkat (Epiphany)', amharicName: 'ጥምቀት (ብርሃነ ጥምቀት)', calendar: 'ethiopic', month: 5, day: 11, category: 'religious', tags: ['christian', 'orthodox', 'public-holiday'] },
  { id: 'genna',      name: 'Genna (Ethiopian Christmas)', amharicName: 'ገና (ኢትዮጵያ የገና በዓል)', calendar: 'ethiopic', month: 4, day: 29, category: 'religious', tags: ['christian', 'orthodox', 'ethiopia', 'public-holiday'] },
  // National days (fixed Ethiopic dates)
  { id: 'adwa_e',     name: 'Adwa Victory Day', amharicName: 'የአድዋ ድል ቀን', calendar: 'ethiopic', month: 6, day: 23, category: 'national', tags: ['ethiopia', 'history', 'public-holiday'] },
  { id: 'patriots_e', name: "Patriots' Victory Day", amharicName: 'የአርበኞች ድል ቀን', calendar: 'ethiopic', month: 8, day: 27, category: 'national', tags: ['ethiopia', 'history', 'public-holiday'] },
  { id: 'derg_e',     name: 'Derg Downfall Day (National Day)', amharicName: 'የደርግ ውድቀት ቀን', calendar: 'ethiopic', month: 9, day: 20, category: 'national', tags: ['ethiopia', 'history', 'national-day', 'public-holiday'] },
  { id: 'nnpd_e',     name: "Nations, Nationalities and Peoples' Day", amharicName: 'የብሄር ብሄረሰቦች ቀን', calendar: 'ethiopic', month: 3, day: 29, category: 'national', tags: ['ethiopia', 'unity', 'public-holiday'] }
  // add more (e.g., saints, fasts) as needed via plugins
];
