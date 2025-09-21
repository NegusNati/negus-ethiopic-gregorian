# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet.

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

[Unreleased]: https://github.com/negusnati/negus-ethiopic-gregorian/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/negusnati/negus-ethiopic-gregorian/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/negusnati/negus-ethiopic-gregorian/releases/tag/v0.1.0
