# negus-ethiopic-gregorian · LLM Reference Guide

This document explains how the v0.2.0 package is structured, what each export does, and how to combine the APIs when generating code automatically.

## Overview

- **Purpose:** Accurate, dependency-free conversions between Ethiopic (Amete Mihret/Amete Alem) and Gregorian calendars, plus rich holiday/highlight utilities.
- **Build profile:** Pure TypeScript compiled to ESM (core + highlights) and a single CJS bundle for the core entry. No runtime deps.
- **Entries:**
  1. `negus-ethiopic-gregorian` (core conversions & arithmetic).
  2. `negus-ethiopic-gregorian/highlights` (optional holiday data & helpers, ESM-only).

## Core Concepts & Types

| Type | Shape | Notes |
| --- | --- | --- |
| `Calendar` | `'ethiopic'  'gregorian'` | Drives conversion helpers and arithmetic.
| `Era` | `'AM'  'AA'` | Defaults to AM; AA is automatically shifted by 5500 years.
| `EthiopicDate` | `{ year, month (1-13), day, era? }` | Month 13 = Pagume (5 days, 6 on leap years).
| `GregorianDate` | `{ year, month (1-12), day }` | Plain numeric object, no timezone info.
| `YearProgress` | `{ daysLeft, totalDaysInYear, percentCompleted }` | Output from `yearProgress`.
| `WeekdayIndex` | `0-6` | 0=Sunday, 6=Saturday (used by `weekdayFromJdn`).

Functions never mutate inputs; they always return new objects.

## Core Entry: `negus-ethiopic-gregorian`

### Constants

- `ETH_EPOCH` – Julian Day Number for 1 Mäskäräm 1 AM (1723856). Useful if you need to align external calculations.
- `AMETE_MIHRET_DELTA` – Year offset (5500) between Amete Alem and Amete Mihret.

### Calendar Conversion API

| Function | Signature | Description |
| --- | --- | --- |
| `toGregorian` | `(ed: EthiopicDate) => GregorianDate` | Converts an Ethiopic date to Gregorian. Era defaults to `'AM'` if omitted. |
| `toEthiopic` | `(gd: GregorianDate) => EthiopicDate` | Converts Gregorian → Ethiopic (always returns `'AM'` era). |
| `ethiopicToJdn` | `(year, month, day, era='AM') => number` | Maps Ethiopic date to Julian Day Number (JDN). |
| `jdnToEthiopic` | `(jdn: number) => EthiopicDate` | Converts a JDN back to Ethiopic. |
| `gregorianToJdn` | `(year, month, day) => number` | Gregorian → JDN using Fliegel–van Flandern algorithm. |
| `jdnToGregorian` | `(jdn: number) => GregorianDate` | Inverse conversion. |
| `weekdayFromJdn` | `(jdn: number) => WeekdayIndex` | Normalised `jdn % 7` with Sunday=0. |

### Calendar Rules

| Function | Description |
| --- | --- |
| `isEthiopicLeapYear(year, era='AM')` | Returns true when `(adjustedYear % 4) === 3`. |
| `ethiopicDaysInMonth(year, month, era='AM')` | 30 for months 1-12; Pagume (13) = 5 or 6 days. Throws on invalid month index. |
| `isGregorianLeapYear(year)` | Standard 400-year rule. |
| `gregorianDaysInMonth(year, month)` | February uses leap-year logic; throws on invalid month. |

### Date Arithmetic & Helpers

| Function | Signature | Notes |
| --- | --- | --- |
| `today` | `(calendar='gregorian') => GregorianDate \| EthiopicDate` | Uses UTC components to avoid timezone drift. |
| `addDays` | `(date, days, calendar) => sameType` | Adds days via JDN. Works across year boundaries. |
| `addMonths` | `(date, months, calendar) => sameType` | Gregorian clamp to month length; Ethiopic handles 13-month cycle and Pagume rollovers. |
| `addYears` | `(date, years, calendar) => sameType` | Leap-day aware (Feb 29 → Feb 28) and Pagume clamp. |
| `previousDay` / `nextDay` | wrappers around `addDays(date, ±1, calendar)` | Convenience shorthands. |
| `lastWeek` / `nextWeek` | wrappers around `addDays(date, ±7, calendar)` | 7-day jumps. |
| `lastMonth` / `nextMonth` | wrappers around `addMonths(date, ±1, calendar)` | Month navigation. |
| `lastYear` / `nextYear` | wrappers around `addYears(date, ±1, calendar)` | Year navigation. |
| `lastCentury` / `nextCentury` | wrappers around `addYears(date, ±100, calendar)` | Century jumps. |
| `yearProgress` | `(date, calendar) => YearProgress` | Computes total days in year, days remaining, and percentage complete (0-100 with 2 decimals). |

### Example: Conversions & Arithmetic

```ts
import {
  toGregorian, toEthiopic,
  today, addDays, yearProgress,
  gregorianDaysInMonth, weekdayFromJdn
} from 'negus-ethiopic-gregorian';

const etDate = { year: 2017, month: 1, day: 1, era: 'AM' };
const gregorian = toGregorian(etDate);   // { year: 2024, month: 9, day: 11 }

const nextFast = addDays(etDate, 55, 'ethiopic');

const progress = yearProgress({ year: 2025, month: 3, day: 2 }, 'gregorian');
// { daysLeft: 305, totalDaysInYear: 365, percentCompleted: 16.44 }

const weekday = weekdayFromJdn(gregorianToJdn(2025, 3, 2)); // 0 = Sunday
const daysInFeb2025 = gregorianDaysInMonth(2025, 2);        // 28
```

## Highlights Entry: `negus-ethiopic-gregorian/highlights`

This entry is intentionally optional (ESM-only) to keep the core bundle small. Import it only when you need holiday data or search helpers.

### Data Exports

- `ETHIOPIAN_HIGHLIGHTS` – Fixed Ethiopic calendar set (Enkutatash, Meskel, Timkat, etc.) with bilingual names and metadata.
- `GREGORIAN_HIGHLIGHTS` – Fixed Gregorian calendar events (Gregorian New Year, Adwa, Labour Day, Derg Downfall, etc.).

### Highlight Utility API

| Function | Description |
| --- | --- |
| `getHighlightsForDay(date, calendar)` | Switches to Gregorian/Ethiopic resolver based on `calendar`. |
| `getHighlightsForGregorianDay(gDate)` | Fixed Gregorian highlights + dynamic rules (Orthodox Easter, Good Friday, Hosanna, Eid al-Fitr, Eid al-Adha, Mawlid). |
| `getHighlightsForEthiopicDay(eDate)` | Ethiopic fixed highlights + converted Gregorian dynamic events that land on the Ethiopic date. |
| `getHighlightsForWeek(startDate, calendar, includeWeekends=true)` | Week-long window with optional weekend filter; returns `HighlightWithDate`. |
| `getHighlightsForMonth(year, month, calendar)` | All highlights in a given month (year-sensitive for dynamic rules). |
| `getHighlightsForYear(year, calendar)` | Year aggregate with canonical IDs (prevents duplicate Meskel/Genna entries). |
| `getHighlightsInRange(startDate, endDate, calendar)` | Inclusive range traversal; useful for agendas. |
| `searchHighlights(query)` | Case-insensitive lookup across English & Amharic names + tags. |
| `getHighlightsByCategory(category, calendar)` | Filter by `HighlightCategory` (`national`, `religious`, `observance`, etc.). |
| `getTodaysHighlights()` | Uses UTC `today()` to resolve current-day highlights across calendars. |
| `listAllHighlights(year, calendar)` | Sorted, canonical list enriched with both Ethiopian & Gregorian representations. |

### Highlight Types

- `Highlight` – Base shape (`id`, `name`, `amharicName`, `calendar`, `month`, `day`, optional `tags`, `category`).
- `HighlightWithDate` – Extends `Highlight` with `date: Date` (Gregorian JS Date) and cross-calendar metadata.
- `ResolvedHighlight` – Structural output from `listAllHighlights` containing canonical IDs and dual-calendar fields.
- `HighlightCategory` – String union of known categories.

### Example: Working with Highlights

```ts
import {
  getTodaysHighlights,
  getHighlightsForMonth,
  searchHighlights,
  listAllHighlights
} from 'negus-ethiopic-gregorian/highlights';

const today = getTodaysHighlights(); // Highlights occurring today (UTC-based).

const meskerem = getHighlightsForMonth(2017, 1, 'ethiopic');
// Includes Enkutatash, Demera, Meskel, etc.

const publicHolidays = listAllHighlights(2025, 'gregorian')
  .filter(h => h.category === 'national' || h.tags?.includes('public-holiday'));

const amharicMatches = searchHighlights('እንቁጣጣሽ');
// Returns both Ethiopic and Gregorian references to Enkutatash.
```

## Implementation Details Useful to LLMs

- **Pure math:** All conversions rely on deterministic integer arithmetic; no floating point tolerance is needed.
- **Era handling:** Functions treat omitted `era` as `'AM'`. Passing `'AA'` triggers `AMETE_MIHRET_DELTA` adjustments automatically.
- **No mutation:** Each helper returns a new object; generated code should not expect in-place updates.
- **Timezone safety:** The only Date usage (`today`) reads UTC fields to avoid local offsets.
- **Canonical IDs:** Highlights may exist in both calendars; utilities map Gregorian aliases (`genna_g`) to canonical Ethiopic IDs (`genna`).
- **Testing note:** Vitest suite currently triggers a Tinypool teardown stack overflow in sandboxed environments; rerun with constrained worker settings if CI requires clean exits.

## Suggested Workflows

1. **Create a countdown:**
   - Fetch `today('ethiopic')`, compute target event via `getHighlightsForEthiopicDay`, and subtract `ethiopicToJdn` values.
2. **Generate a holiday calendar:**
   - Use `listAllHighlights(year, 'gregorian')`, then map over results to render the Gregorian `date` alongside Ethiopic metadata.
3. **Validate user input:**
   - Check `ethiopicDaysInMonth(year, month)` before accepting a day value; similar for Gregorian.
4. **Match highlight by tag:**
   - Call `searchHighlights` or iterate `ETHIOPIAN_HIGHLIGHTS` / `GREGORIAN_HIGHLIGHTS` and filter by `tags`.

## Build & Release Checklist

- `npm run build` → generates `dist/index.js`, `dist/index.cjs`, `dist/highlights.js`, and declaration files.
- `npm_config_cache=.tmp-npm-cache npm pack --dry-run --json` → confirms output size (~41.8 kB unpacked for 0.2.x).
- `vitest run` (or with custom workshop settings) → ensures regression coverage passes.
- Pushing a tag like `v0.2.1` triggers `.github/workflows/release.yml` which runs the verify matrix, publishes to npm and GitHub Packages, and creates a GitHub Release from the corresponding `release-notes/` entry.
- Required secrets: set `NPM_TOKEN` (publish access on npm); `GITHUB_TOKEN` is provided automatically for GitHub Packages and release creation.

Armed with this guide, an LLM can generate accurate usage samples, integrate holiday lookups, or extend conversion logic without combing through source files.
