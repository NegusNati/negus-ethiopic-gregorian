# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet.

## [0.2.3] - 2025-09-22

### Docs
- Added Ethiopian National Flag Day to README highlights table
- Enhanced documentation with proper highlight descriptions

## [0.2.2] - 2025-09-22

### Added
- Ethiopian National Flag Day - dynamic highlight that calculates the first Monday of Tikimt (Ethiopian month) each year
- Updated "International Labour Day" to "International Labor Day" (standardized American spelling)

### Improved  
- Enhanced dynamic highlight calculation system with robust year overlap handling for Ethiopian calendar-based holidays

## [0.2.1] - 2025-09-22

### Added
- Comprehensive LLM-oriented reference docs (`llm.txt`, `llm.md`) detailing conversion APIs, highlight utilities, and release workflows.
- Automated release pipeline that verifies tags, publishes to npm and GitHub Packages, and creates GitHub releases from `release-notes/`.

### Docs
- Expanded README callout on the highlights subpath and size considerations.
- Updated release collateral to reflect the new docs and usage guidance.

## [0.2.0] - 2025-09-22

### Changed
- Split highlight utilities into the `negus-ethiopic-gregorian/highlights` entry to keep the core converter bundle under 1 KB minified.
- Documented the new import path in README along with context on bundle size improvements.

### Removed
- CJS build for the highlight utilities; the subpath is now ESM-only to avoid duplicated bundles.

### Docs
- Updated release notes to reflect the refined packaging and highlight entry.

## [0.1.2] - 2025-09-21

### Fixed
- Preserved Ethiopic day numbers when rolling Pagume into Meskerem so `addMonths` remains symmetric with `lastMonth`.

### Tests
- Added round-trip coverage for Pagume days 1-5 and the leap-day case to guard Ethiopic month arithmetic.

## [0.1.1] - 2025-09-21

### Added
- Full Ethiopic ↔ Gregorian conversion toolkit, including JDN helpers and strict type definitions.
- Utilities for date arithmetic (days, months, years) and year progress calculations.
- Extensive highlight datasets for Ethiopian and Gregorian calendars with bilingual (English/Amharic) labels.
- Highlight query helpers: today's highlights, search, range filters, and calendar-specific lookups.
- Tooling and quality gates: strict TypeScript config, Vitest coverage, ESLint linting, and GitHub Actions pipeline.

### Features
- Zero-dependency, tree-shakeable ESM/CJS bundles built with `tsup`.
- Accurate integer-based algorithms supporting both Amete Mihret (AM) and Amete Alem (AA) eras.
- UTC-based `today()` helper to avoid timezone drift.
- Reliable leap-year handling across both calendars.

## [0.1.0] - 2025-01-21

### Added
- Initial implementation of core functionality
- Basic test coverage
- Documentation and project structure

[Unreleased]: https://github.com/negusnati/negus-ethiopic-gregorian/compare/v0.2.3...HEAD
[0.2.3]: https://github.com/negusnati/negus-ethiopic-gregorian/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/negusnati/negus-ethiopic-gregorian/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/negusnati/negus-ethiopic-gregorian/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/negusnati/negus-ethiopic-gregorian/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/negusnati/negus-ethiopic-gregorian/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/negusnati/negus-ethiopic-gregorian/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/negusnati/negus-ethiopic-gregorian/releases/tag/v0.1.0
