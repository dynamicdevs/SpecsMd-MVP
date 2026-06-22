---
stage: implement
bolt: 002-ticket-purchase
created: 2026-06-19T21:24:54Z
---

## Implementation Walkthrough: 002-ticket-purchase

### Summary

Implemented the pure purchase-preparation workflow on top of the completed cinema catalog unit. Requests are normalized before any data reads, seat selections are validated all-or-nothing, prices use exact integer minor units, and Tuesday eligibility comes solely from the fixture's UTC timestamp.

### Structure Overview

Domain modules own request, selection, pricing, and discount invariants without importing Commander.js, filesystem APIs, process state, or console output. A small application service composes those pure rules with the existing injected catalog and state readers and returns a prepared purchase plus its unchanged prior-state snapshot for the later persistence bolt.

### Completed Work

- [x] `codex-specsmd/src/domain/errors.ts` - Adds stable request, selection, and pricing error codes plus structured seat-selection details.
- [x] `codex-specsmd/src/domain/purchase-types.ts` - Defines untrusted input, normalized requests, validated selections, exact pricing, and prepared-purchase values.
- [x] `codex-specsmd/src/domain/purchase-request.ts` - Trims required fields, uppercases seats, and rejects empty or duplicate normalized input.
- [x] `codex-specsmd/src/domain/seat-selection.ts` - Resolves showtime and auditorium and reports every nonexistent or sold requested seat without mutation.
- [x] `codex-specsmd/src/domain/pricing.ts` - Applies the closed 2D, 3D, and IMAX price table with safe-integer validation.
- [x] `codex-specsmd/src/domain/discount.ts` - Applies deterministic Tuesday eligibility and 20% half-up rounding using UTC fixture time.
- [x] `codex-specsmd/src/application/prepare-purchase.ts` - Composes request validation, injected reads, selection validation, pricing, and discount into a persistence-neutral result.
- [x] `codex-specsmd/src/domain/index.ts` - Exposes the new pure domain surface.
- [x] `codex-specsmd/src/index.ts` - Exposes the purchase-preparation application service.

### Key Decisions

- **Validate before reads**: Request shape and duplicates fail before either repository is called.
- **Structured selection failure**: One error carries separate nonexistent and sold seat collections for deterministic CLI rendering later.
- **No state transition**: This bolt returns the unchanged state snapshot and leaves state creation and writing to `003-ticket-purchase`.
- **Integer-only money**: Unit price, subtotal, discount, and total remain safe integers in minor units.
- **UTC Tuesday rule**: Weekday calculation ignores host timezone, current clock, and locale.
- **No new dependencies**: Strict TypeScript and standard language operations cover every rule.

### Deviations from Plan

None. Persistence, confirmation sequencing, and CLI concerns remain deferred exactly as planned.

### Dependencies Added

None.

### Verification Performed

- [x] `npm run lint` completed successfully.
- [x] `npm run build` completed successfully.
- [x] Domain source contains no Commander.js, filesystem, path, process, or console usage.
- [x] Existing catalog interfaces were reused without changing completed catalog behavior.

### Developer Notes

Stage 3 should prove that invalid requests do not invoke readers, mixed seat failures report both categories, half-up rounding is exercised with a fractional minor-unit result, and the preparation service leaves its state snapshot unchanged.
