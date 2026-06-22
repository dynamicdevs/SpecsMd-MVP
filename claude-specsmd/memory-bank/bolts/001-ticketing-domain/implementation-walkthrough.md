---
stage: implement
bolt: 001-ticketing-domain
created: 2026-06-19T00:00:00Z
---

## Implementation Walkthrough: ticketing-domain

### Summary

Implemented the pure ticketing domain plus minimal TypeScript + Vitest scaffolding so the domain can be type-checked and tested. The domain has no I/O and imports no framework or `console`; all monetary values are integer cents.

### Structure Overview

A single `src/domain/` folder holds data-only types, typed error classes, and four small rule modules (pricing, discount, seat validation, confirmation), re-exported through a domain `index.ts`. Project-root config files provide a minimal strict-TS + Vitest setup that later bolts (CLI, scripts) build on.

### Completed Work

- [x] `package.json` - Minimal package: `type: module`, dev deps (typescript, vitest), `test`/`test:watch`/`typecheck` scripts
- [x] `tsconfig.json` - Strict TypeScript config (`strict`, `noUncheckedIndexedAccess`)
- [x] `vitest.config.ts` - Test runner config (includes `src/**/*.test.ts`)
- [x] `src/domain/types.ts` - Movie, Showtime, Seat, SeatStatus, Format, Order, Confirmation; `Cents` convention
- [x] `src/domain/errors.ts` - `DomainError` base + Empty/Duplicate/Unknown/Unavailable seat errors + missing-name error
- [x] `src/domain/pricing.ts` - `priceSeats` + injectable `PricingConfig` / `DEFAULT_PRICING`
- [x] `src/domain/discount.ts` - `applyTuesdayDiscount` + `isTuesday` (UTC weekday, half-up rounding)
- [x] `src/domain/seats.ts` - `validateSeatSelection` (all-or-nothing) + `normalizeSeatCode`
- [x] `src/domain/confirmation.ts` - `generateConfirmation` with deterministic FNV-1a confirmation ID
- [x] `src/domain/index.ts` - Public domain API barrel (the single allowed local index)

### Key Decisions

- **Integer cents everywhere**: avoids floating-point currency drift; pricing config is injectable so tests pin exact values.
- **Deterministic Tuesday rule**: weekday derived from a passed-in `Date` via `getUTCDay()`, never the wall clock; rounding is half-up and documented.
- **Deterministic confirmation ID**: FNV-1a hash of order + movie title + name + seed instead of a random UUID, so tests are reproducible.
- **All-or-nothing validation**: empty/duplicate/unknown/sold are checked across the whole set before any seat is accepted; errors carry the offending codes for clear messages.

### Deviations from Plan

- `generateConfirmation` takes an explicit `movieTitle` argument (the `Showtime` does not carry the movie title, and `Order` is kept minimal). Signature: `generateConfirmation(order, movieTitle, customerName, seed?)`.
- Added a `MissingCustomerNameError` (not enumerated in the plan) so an empty name is a typed domain error rather than a generic `Error`.

### Dependencies Added

- [x] `typescript` (dev) - strict type checking
- [x] `vitest` (dev) - unit test runner

### Developer Notes

- Tests will be authored and executed in Stage 3; `npm install` is required there to run them (no `node_modules` yet).
- The CLI layer (bolts 002/003) should import only from `src/domain` (the barrel), never reach into individual files.
