---
stage: plan
bolt: 001-ticketing-domain
created: 2026-06-19T00:00:00Z
---

## Implementation Plan: ticketing-domain

### Objective

Build the pure, framework-free domain core for the cinema CLI — types plus the rules for seat validation, format pricing, the Tuesday discount, and deterministic confirmation generation — fully unit-tested with Vitest and free of any I/O or framework imports.

### Deliverables

Source modules under `src/domain/` (pure; no `console`, no Commander.js, no `fs`):

- `src/domain/types.ts` — `Movie`, `Showtime`, `Seat`, `SeatStatus`, `Format` (`'2D' | '3D' | 'IMAX'`), `Order`, `Confirmation`, and a `Money`/cents convention.
- `src/domain/errors.ts` — typed domain errors: `UnknownSeatError`, `SeatUnavailableError`, `EmptySeatSelectionError`, `DuplicateSeatError`.
- `src/domain/pricing.ts` — `priceSeats(format, seatCount, config)` and default `PricingConfig`.
- `src/domain/discount.ts` — `applyTuesdayDiscount(subtotalCents, showtimeDate)`.
- `src/domain/seats.ts` — `validateSeatSelection(showtime, requestedCodes)`.
- `src/domain/confirmation.ts` — `generateConfirmation(order, customerName, seed)` with deterministic ID.
- `src/domain/index.ts` — domain entry that re-exports the public API (the single allowed local index per coding-standards).

### Dependencies

- 001-ticketing-domain has **no** upstream dependencies (foundational bolt).
- Runtime deps: none (pure TypeScript). Dev deps assumed from tech-stack: TypeScript, Vitest. (Package scaffolding/`package.json` is owned by bolt 003's `cli-entry-and-scripts`; this bolt assumes a minimal TS + Vitest setup exists or is added minimally to run tests.)

### Technical Approach

- **Money in integer cents.** Defaults: `base = 1000`, `surcharge['3D'] = 300`, `surcharge['IMAX'] = 600`, `surcharge['2D'] = 0`. `PricingConfig` is injectable so tests pin values.
- **Validation (all-or-nothing).** Build a map of `code → status` from the showtime; reject the whole request if any code is unknown, duplicated, sold, or the set is empty. Errors carry the offending codes. Normalize seat codes to uppercase for comparison.
- **Tuesday discount.** Derive weekday from the `Showtime.startsAt` date (injected, not `new Date()`); 20% off subtotal; rounding is **round half-up to whole cents**, documented. Returns `{ discountCents, totalCents }`.
- **Confirmation.** Deterministic ID derived from a stable hash of order fields + `seed` (no random UUID, no clock). Returns all six required fields (movie title, showtime, seats, customer name, total, confirmation ID).
- **Purity guard.** No imports of `fs`, `commander`, or `console` anywhere in `src/domain` (also enforced by ESLint rule in coding-standards).
- **Tests** (`*.test.ts` co-located): pricing for 2D/3D/IMAX × seat counts; discount on Tuesday vs non-Tuesday + rounding; validation for unknown/sold/duplicate/empty; confirmation field completeness + determinism.

### Acceptance Criteria

- [ ] Domain types exist for Movie, Showtime, Seat, SeatStatus, Format, Order, Confirmation; money in cents (FR-5..8 foundation; story 001)
- [ ] `validateSeatSelection` passes valid sets and throws typed errors naming offending seats for unknown/sold/duplicate/empty, all-or-nothing (FR-5; story 002)
- [ ] `priceSeats` returns N×base for 2D, N×(base+300) for 3D, N×(base+600) for IMAX, in cents (FR-6; story 003)
- [ ] `applyTuesdayDiscount` applies 20% only on Tuesday (by injected date), deterministic rounding (FR-7; story 004)
- [ ] `generateConfirmation` returns all six fields with a deterministic, reproducible ID (FR-8; story 005)
- [ ] No I/O or framework imports in `src/domain`; TypeScript strict passes with no `any`
- [ ] Vitest unit tests cover pricing, discount, validation, and confirmation and pass
