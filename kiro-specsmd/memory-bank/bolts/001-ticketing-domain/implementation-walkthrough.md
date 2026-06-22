---
stage: implement
bolt: 001-ticketing-domain
created: 2026-06-21T00:00:00Z
---

## Implementation Walkthrough: ticketing-domain

### Summary

Pure domain logic implemented as individual TypeScript modules exporting functions. No classes, no I/O, no side effects. Money handled as integers in centavos.

### Structure Overview

Flat module structure under `src/domain/` with one file per concern, barrel-exported via `index.ts`.

### Completed Work

- [x] `src/domain/types.ts` - All domain types: Movie, Showtime, Seat, PurchaseInput, Confirmation, ValidationResult, DiscountResult
- [x] `src/domain/validation.ts` - Seat validation with all-or-nothing semantics and deduplication
- [x] `src/domain/pricing.ts` - Format-based pricing (2D/3D/IMAX) with exported constants
- [x] `src/domain/discount.ts` - Tuesday 20% discount with UTC-based day detection
- [x] `src/domain/confirmation.ts` - Deterministic confirmation via SHA-256 hash (8 hex chars)
- [x] `src/domain/index.ts` - Barrel export for all domain functions and types

### Key Decisions

- **Money in centavos**: Avoids floating point issues entirely
- **Discriminated union for ValidationResult**: Type-safe error handling without exceptions in happy path
- **UTC day for discount**: Using `getUTCDay()` after appending `T00:00:00` ensures consistent behavior across timezones
- **Sorted seats before hash**: Ensures order-independence for confirmation ID determinism

### Deviations from Plan

None

### Dependencies Added

- [x] `@types/node` - Required for `node:crypto` type declarations

### Developer Notes

- `applyDiscount` appends `T00:00:00` to date string to avoid timezone offset issues with `new Date()`
- Validation returns on first invalid seat (short-circuit), which is fine for the all-or-nothing semantics
