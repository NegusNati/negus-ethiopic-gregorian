# negus-ethiopic-gregorian

Accurate, dependency-free conversions between **Ethiopian (Ethiopic)** and **Gregorian** calendars in **TypeScript**. Tiny bundle, strict types, tree-shakeable, and designed for extension (highlights/holidays & locales).

> Algorithms follow well-known references and community-vetted implementations. See **Accuracy & references** below.

## Install

```bash
npm i negus-ethiopic-gregorian
# or pnpm add / yarn add
```

## Quick start

```ts
import {
  toGregorian, toEthiopic, today,
  yearProgress, nextWeek
} from 'negus-ethiopic-gregorian';
import {
  ETHIOPIAN_HIGHLIGHTS, GREGORIAN_HIGHLIGHTS,
  getHighlightsForDay, getTodaysHighlights, searchHighlights
} from 'negus-ethiopic-gregorian/highlights';

// Highlight helpers live in a separate entry so the core converter stays tiny (<1 KB minified).

// Convert EC → GC
const g = toGregorian({ year: 2017, month: 1, day: 1 }); // => { year: 2024, month: 9, day: 11 }

// Convert GC → EC
const e = toEthiopic({ year: 2025, month: 1, day: 7 });  // => { year: 2017, month: 4, day: 29, era: 'AM' }

// Utilities
const ecToday = today('ethiopic');
const next = nextWeek(ecToday as any, 'ethiopic');

const gp = yearProgress({ year: 2025, month: 9, day: 21 }, 'gregorian');
// -> { daysLeft, totalDaysInYear, percentCompleted }

// Highlights (with utility functions)
console.log(getTodaysHighlights());
// Returns all highlights for today with both English and Amharic names

// Get highlights for a specific date
const dayHighlights = getHighlightsForDay({ year: 2017, month: 1, day: 1 }, 'ethiopic');
console.log(dayHighlights[0].amharicName); // "እንቁጣጣሽ (ኢትዮጵያ አዲስ ዓመት)"

// Search highlights by name
const searchResults = searchHighlights('New Year');
console.log(searchResults.length); // 2 (both Ethiopian and Gregorian New Year)
```

## API (selected)

* `toGregorian(ed: EthiopicDate): GregorianDate`
* `toEthiopic(gd: GregorianDate): EthiopicDate`
* `isEthiopicLeapYear(y: number, era?: 'AM'|'AA'): boolean`
* `ethiopicDaysInMonth(y: number, m: number, era?: Era): number`
* `gregorianDaysInMonth(y: number, m: number): number`
* `today(calendar?: 'ethiopic'|'gregorian')`
* `addDays|addMonths|addYears`, `previousDay|nextDay`, `lastWeek|nextWeek|lastMonth|nextMonth|lastYear|nextYear|lastCentury|nextCentury`
* `yearProgress(date, calendar): { daysLeft, totalDaysInYear, percentCompleted }`
* `negus-ethiopic-gregorian/highlights` exports `ETHIOPIAN_HIGHLIGHTS`, `GREGORIAN_HIGHLIGHTS`, `getHighlightsForDay(...)`, `getHighlightsForGregorianDay(...)`, `getHighlightsForEthiopicDay(...)`, `getHighlightsForWeek(...)`, `getHighlightsForMonth(...)`, `getHighlightsForYear(...)`, `getHighlightsInRange(...)`, `searchHighlights(...)`, `getTodaysHighlights()`, `listAllHighlights(...)`

## Highlights & Holidays

The package includes comprehensive support for Ethiopian and Gregorian holidays with bilingual names (English and Amharic). Highlights carry optional `category` and `tags` (e.g., `public-holiday`, `christian`, `muslim`).

### Built-in Highlights

**At a Glance (selected public holidays)**

| ID                | English                              | Amharic                                 | Calendar   | Canonical Date             | Category   | Tags                               |
|-------------------|--------------------------------------|-----------------------------------------|------------|----------------------------|------------|------------------------------------|
| enkutatash        | Ethiopian New Year (Enkutatash)      | እንቁጣጣሽ                              | Ethiopic   | Meskerem 1                 | national   | ethiopia, new-year, public-holiday |
| genna             | Ethiopian Christmas (Genna)          | ገና                                     | Ethiopic   | Tahsas 29                  | religious  | christian, orthodox, public-holiday|
| timkat            | Ethiopian Epiphany (Timkat)          | ጥምቀት                                   | Ethiopic   | Tir 11                     | religious  | christian, orthodox, public-holiday|
| meskel            | Meskel (Finding of the True Cross)   | መስቀል                                  | Ethiopic   | Meskerem 17                | religious  | christian, orthodox, public-holiday|
| adwa              | Adwa Victory Day                     | የአድዋ ድል ቀን                           | Gregorian  | Mar 2                      | national   | ethiopia, history, public-holiday  |
| patriots          | Patriots' Victory Day                 | የአርበኞች ድል ቀን                        | Gregorian  | May 5                      | national   | ethiopia, history, public-holiday  |
| derg              | Derg Downfall Day (National Day)     | የደርግ ውድቀት ቀን                        | Gregorian  | May 28                     | national   | ethiopia, history, public-holiday  |
| nnpd              | Nations, Nationalities & Peoples’ Day| የሕዝቦች ብሔሮችና ብሄራዊ ቀን            | Gregorian  | Dec 8                      | national   | ethiopia, unity, public-holiday    |
| fasika            | Ethiopian Easter (Fasika)             | ፋሲካ                                    | Dynamic    | Orthodox Easter (varies)   | religious  | christian, orthodox, public-holiday|
| good_friday       | Good Friday (Orthodox/Ethiopian)     | ስቅለት ዓርብ                             | Dynamic    | 2 days before Easter       | religious  | christian, orthodox, public-holiday|
| hosanna           | Hosanna (Palm Sunday)                | ሆሳና                                    | Dynamic    | 7 days before Easter       | religious  | christian, orthodox               |
| eid_al_fitr       | Eid al‑Fitr                           | ኢድ አል‑ፊትር                            | Dynamic    | 1 Shawwal (tabular Hijri)  | religious  | muslim, islamic, public-holiday   |
| eid_al_adha       | Eid al‑Adha                           | ኢድ አል‑አድሐ                             | Dynamic    | 10 Dhu al‑Hijjah (tabular) | religious  | muslim, islamic, public-holiday   |
| mawlid            | Mawlid (Prophet’s Birthday)          | መውሊድ                                   | Dynamic    | 12 Rabi’ al‑awwal (tabular)| religious  | muslim, islamic, public-holiday   |

Notes:
- “Canonical Date” shows the defining calendar. Ethiopic entries convert to their Gregorian counterpart automatically (e.g., Meskerem 17 ≈ Sep 27; sometimes Sep 28). Islamic dates use the civil/tabular Hijri calendar; observed dates can shift by ±1 day.
- The full lists are available in `src/highlights/ethiopian.ts` and `src/highlights/gregorian.ts`, and movable feasts in `src/highlights/rules.ts`.

### Highlight Utilities

```ts
import {
  getTodaysHighlights,
  getHighlightsForEthiopicDay,
  searchHighlights,
  getHighlightsForMonth
} from 'negus-ethiopic-gregorian/highlights';

// Get today's highlights
const todayHighlights = getTodaysHighlights();

// Get highlights for a specific date
const newYearHighlights = getHighlightsForEthiopicDay({
  year: 2017, month: 1, day: 1, era: 'AM'
});

// Search highlights
const results = searchHighlights('እንቁጣጣሽ'); // Search by Amharic name
const englishResults = searchHighlights('New Year'); // Search by English name

// Get highlights for a month
const janHighlights = getHighlightsForMonth(2017, 1, 'ethiopic');
```

### Filtering by Tag

You can filter by tags such as `public-holiday`, `christian`, `muslim`, or `national` using `listAllHighlights` and a simple predicate.

```ts
import { listAllHighlights } from 'negus-ethiopic-gregorian/highlights';

// All Ethiopian public holidays in Ethiopic year 2017
const all2017 = listAllHighlights(2017, 'ethiopic');
const publicHolidays = all2017.filter(h => h.tags?.includes('public-holiday'));

// Only Christian/Orthodox religious days in Gregorian 2025
const all2025 = listAllHighlights(2025, 'gregorian');
const orthodox = all2025.filter(h => h.tags?.includes('christian') && h.tags?.includes('orthodox'));

// National days in Gregorian 2025
const national = all2025.filter(h => h.category === 'national');
```

## Time & accuracy

- UTC-only reads: Functions that derive "today" or dates from the system clock use UTC components to avoid timezone drift and off-by-one errors. `getTodaysHighlights()` and `today()` rely on UTC.
- Orthodox Easter: Calculated from the Julian calendar date converted via JDN to Gregorian (works across centuries; not limited to a fixed +13 days offset).

## Size & performance

* No runtime dependencies. Pure integer math for conversions.
* Core converter bundle ships as both ESM + CJS; highlight utilities live in an optional ESM entry to keep the default install lean.
* Uses UTC-only date reads to avoid timezone pitfalls.

## LLM & automation guides

* [`llm.md`](./llm.md) – Structured reference for code-generation tools (APIs, usage patterns, workflows).
* [`llm.txt`](./llm.txt) – Plain-text variant for prompt injection or lightweight consumption.

## CI/CD

* [`ci.yml`](.github/workflows/ci.yml) runs lint, tests, and build on pushes and pull requests across Node 18 & 20.
* [`release.yml`](.github/workflows/release.yml) kicks in on `v*` tags: verifies the build, publishes to npm (requires `NPM_TOKEN`) and GitHub Packages, then creates a GitHub Release using the matching `release-notes/` entry.

## Accuracy & references

* Ethiopic epoch (1 Mäskäräm 1 AM = 29 Aug 8 CE, Julian), `ETH_EPOCH = 1723856`; Amete Alem delta `5500`. Algorithms follow established OSS implementations. ([GitHub][2])
* Ethiopic leap-year rule `year % 4 === 3`; New Year falls on Sept 11 (or Sept 12 in Gregorian leap years). ([Joda][1])
* Gregorian↔JDN uses USNO's Fliegel–van Flandern integer formulas; Julian↔JDN is used for Orthodox Easter; weekday derived from JDN mod 7. ([US Naval Observatory][3])
* Highlights: Meskel Meskerem 17 (= Sept 27 or 28 G‑leap), Genna = Tahsas 29 (= Jan 7), Timkat = Tir 11 (= Jan 19), Adwa = Mar 2, Patriots' = May 5, Derg Downfall = May 28. ([Wikipedia][6])

> **Note.** Some observances (e.g., Timkat's eve "Ketera" on Tir 10) and movable feasts (Easter, fasting periods, Hijri-based dates) can be added later via functional rules without changing core APIs.

## Search semantics

`searchHighlights(query)` searches both English and Amharic names across fixed Ethiopic and Gregorian highlights, and also includes dynamic highlights (e.g., Fasika, Good Friday, Eid, Mawlid) for the current UTC Gregorian year so results contain concrete dates.

## Roadmap / Extensibility

* [ ] **Rule engine** for highlights: function‑based rules (`(year) => EthiopicDate | GregorianDate`) for leap‑dependent days (e.g., Meskel G‑leap shift) and movable feasts.
* [ ] **Locale packs**: richer month/weekday names and formatters (Amharic, Afaan Oromo, Tigrinya).
* [ ] **Formatting** helpers (`format(date, pattern, locale)`).
* [ ] **Julian calendar** support (historical switchovers) as optional plugin.

## Development

```bash
git clone <your repo>
cd negus-ethiopic-gregorian
npm ci
npm test
npm run build
```

## License

MIT

[1]: https://www.joda.org/joda-time/cal_ethiopic.html?utm_source=chatgpt.com "Joda-Time – Java date and time API - Ethiopic calendar system"
[2]: https://github.com/adobe/react-spectrum/blob/main/packages/%40internationalized/date/src/calendars/EthiopicCalendar.ts?utm_source=chatgpt.com "react-spectrum/packages/@internationalized/date/src/calendars ... - GitHub"
[3]: https://aa.usno.navy.mil/faq/JD_formula "Converting Between Julian Dates and Gregorian Calendar Dates"
[6]: https://en.wikipedia.org/wiki/Meskel?utm_source=chatgpt.com "Meskel"
