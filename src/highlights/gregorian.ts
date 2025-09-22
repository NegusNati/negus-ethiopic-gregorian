import type { Highlight } from './types';

export const GREGORIAN_HIGHLIGHTS: Highlight[] = [
  { id: 'g_new_year',    name: 'New Year\'s Day', amharicName: 'አዲስ ዓመት ቀን', calendar: 'gregorian', month: 1,  day: 1,  category: 'observance', tags: ['international'] },
  { id: 'timkat_g',      name: 'Ethiopian Epiphany (Timkat)', amharicName: 'ጥምቀት (ቲምቃት)', calendar: 'gregorian', month: 1,  day: 19, category: 'religious', tags: ['christian', 'orthodox', 'ethiopia', 'public-holiday'] },
  { id: 'genna_g',       name: 'Ethiopian Christmas (Genna)', amharicName: 'ገና (ኢትዮጵያ)', calendar: 'gregorian', month: 1,  day: 7,  category: 'religious', tags: ['christian', 'orthodox', 'ethiopia', 'public-holiday'] },
  { id: 'adwa',          name: 'Adwa Victory Day (ET)', amharicName: 'የአድዋ ድል ቀን', calendar: 'gregorian', month: 3,  day: 2,  category: 'national',   tags: ['ethiopia', 'history', 'public-holiday'] },
  { id: 'labour',        name: 'International Labor Day', amharicName: 'ዓለም አቀፍ የሠራተኞች ቀን', calendar: 'gregorian', month: 5,  day: 1,  category: 'observance', tags: ['international', 'labor', 'public-holiday'] },
  { id: 'patriots',      name: 'Patriots\' Victory Day (ET)', amharicName: 'የአርበኞች ድል ቀን', calendar: 'gregorian', month: 5,  day: 5,  category: 'national',   tags: ['ethiopia', 'history', 'public-holiday'] },
  { id: 'derg',          name: 'Derg Downfall Day (ET)', amharicName: 'የደርግ ውድቀት ቀን', calendar: 'gregorian', month: 5,  day: 28, category: 'national',   tags: ['ethiopia', 'history', 'national-day', 'public-holiday'] },
  { id: 'enkutatash_g',  name: 'Ethiopian New Year (Enkutatash)', amharicName: 'እንቁጣጣሽ (ኢትዮጵያ አዲስ ዓመት)', calendar: 'gregorian', month: 9, day: 11, category: 'national', tags: ['ethiopia', 'new-year', 'public-holiday'] },
  { id: 'meskel_g',      name: 'Meskel (ET) – Gregorian observance', amharicName: 'መስቀል (ኢትዮጵያ) – ግሪጎሪያን አከባበር', calendar: 'gregorian', month: 9, day: 27, category: 'religious', tags: ['christian', 'orthodox', 'ethiopia', 'public-holiday'] },
  { id: 'nnpd',          name: 'Nations, Nationalities and Peoples\' Day (ET)', amharicName: 'የሕዝቦች ብሔሮችና ብሄራዊ ቀን', calendar: 'gregorian', month: 12, day: 8, category: 'national', tags: ['ethiopia', 'unity', 'public-holiday'] },
  { id: 'christmas',     name: 'Christmas Day', amharicName: 'የገና ቀን', calendar: 'gregorian', month: 12, day: 25, category: 'religious', tags: ['christian'] }
];
