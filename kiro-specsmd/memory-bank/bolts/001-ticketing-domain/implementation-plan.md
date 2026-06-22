---
stage: plan
bolt: 001-ticketing-domain
created: 2026-06-21T00:00:00Z
---

## Implementation Plan: ticketing-domain

### Objective
Implement pure domain logic for the cinema CLI: types, seat validation, format-based pricing, Tuesday discount, and deterministic confirmation generation.

### Deliverables
- `src/domain/types.ts` — Domain types and interfaces
- `src/domain/validation.ts` — Seat validation (all-or-nothing)
- `src/domain/pricing.ts` — Price calculation by format
- `src/domain/discount.ts` — Tuesday discount logic
- `src/domain/confirmation.ts` — Deterministic confirmation generation
- `src/domain/index.ts` — Barrel export

### Dependencies
- Node.js `crypto` (built-in, for SHA-256 hash)
- No external dependencies

### Technical Approach
- Pure exported functions (no classes)
- Money always in centavos (integers)
- Discriminated unions for results (success/error)
- ScreenFormat as union type: '2D' | '3D' | 'IMAX'
- Prices: 2D=5000, 3D=7000, IMAX=12000 centavos
- Discount: 20% if new Date(showtimeDate).getDay() === 2
- Confirmation ID: SHA-256 of `${customer}|${showtimeId}|${sortedSeats}` truncated to 8 hex chars

### Acceptance Criteria
- [ ] All types exported, no `any`
- [ ] validateSeats rejects invalid/sold seats, accepts valid, all-or-nothing
- [ ] calculatePrice returns correctly for 2D, 3D, IMAX × N seats
- [ ] applyDiscount applies 20% only on Tuesday, returns integer
- [ ] generateConfirmation produces deterministic ID with all fields
