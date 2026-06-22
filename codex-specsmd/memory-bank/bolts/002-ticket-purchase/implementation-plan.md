---
stage: plan
bolt: 002-ticket-purchase
created: 2026-06-19T20:57:33Z
---

## Implementation Plan: 002-ticket-purchase

### Objective

Implement the pure, deterministic half of the ticket-purchase workflow: normalize purchase requests, reject invalid or unavailable seats as one atomic selection, calculate format-based prices in integer minor units, and apply the 20% Tuesday discount from the fixture timestamp.

### Stories in Scope

1. **001-submit-purchase-request**: Validate and normalize customer, showtime, and seat inputs without Commander.js or state access.
2. **002-validate-seat-selection**: Validate all requested seats against the auditorium and persisted sold-seat snapshot, reporting every offending seat without mutation.
3. **003-calculate-format-pricing**: Apply exact prices of 800, 1100, and 1500 minor units for 2D, 3D, and IMAX.
4. **004-apply-tuesday-discount**: Apply a deterministic 20% half-up discount based only on the showtime's UTC fixture date.

### Deliverables

1. Purchase request, money, pricing result, and prepared-purchase domain types.
2. Stable typed error codes for invalid requests, invalid selections, and unsupported pricing inputs.
3. A pure request normalizer that trims identifiers and customer names, uppercases seats, and detects normalized duplicates.
4. A pure all-or-nothing seat validator that distinguishes nonexistent and sold seats while preserving the prior state.
5. A table-driven pure price calculator using integer minor units and positive seat counts.
6. A pure Tuesday-discount calculation using UTC weekday semantics and integer half-up rounding.
7. An application service that loads the completed catalog/state boundaries and returns a prepared purchase without persisting anything.
8. Stage 3 unit tests covering all request, selection, format, discount, rounding, timezone, and immutability branches.

### Planned Structure

```text
codex-specsmd/src/
  domain/
    purchase-types.ts
    purchase-request.ts
    seat-selection.ts
    pricing.ts
    discount.ts
  application/
    prepare-purchase.ts
```

Existing catalog types, errors, repository ports, and JSON readers remain the source of trusted movies, showtimes, auditorium layouts, and sold-seat state.

### Dependencies

1. **001-cinema-catalog**: Completed trusted catalog/state types and read ports.
2. **No new packages**: All behavior uses strict TypeScript and standard JavaScript integer/date operations.
3. **No persistence writer**: This bolt reads a state snapshot but never writes it.
4. **No Commander.js imports**: CLI parsing and rendering remain assigned to `004-cli-application`.

### Technical Approach

1. Treat raw purchase input fields as untrusted strings and arrays; normalize once at the domain boundary.
2. Reject whitespace-only customers, empty showtime IDs, empty seat selections, empty seat labels, and duplicates after uppercase normalization.
3. Resolve the showtime and auditorium from the validated catalog, then partition requested seats into nonexistent and already-sold groups.
4. Throw one typed selection error containing both groups; never mutate the request, catalog, or state snapshot.
5. Store currency values as integer minor units with `USD` as the single configured currency.
6. Use a closed price map: 2D = 800, 3D = 1100, IMAX = 1500.
7. Reject zero, negative, non-integer, or unsafe seat counts and unsupported runtime format strings.
8. Determine Tuesday with `getUTCDay()` from the already validated UTC fixture timestamp, never from the host clock or locale.
9. Compute 20% discount through integer arithmetic and a half-up rule; return subtotal, discount, and total explicitly.
10. Compose these operations in a preparation service whose result is suitable for the persistence bolt.

### Acceptance Criteria

- [ ] Nonblank customer, known showtime, and at least one seat produce a normalized immutable request.
- [ ] Blank fields, empty seats, empty labels, and duplicate case-insensitive seats fail before catalog/state reads in the application service.
- [ ] Every selected seat must exist and be unsold for the chosen auditorium/showtime.
- [ ] Mixed valid and invalid selections reject the complete selection and identify all nonexistent and sold seats.
- [ ] Failed preparation leaves purchases, sold seats, and confirmation sequence unchanged.
- [ ] 2D, 3D, and IMAX use exactly 800, 1100, and 1500 minor units per seat.
- [ ] Subtotal equals unit price multiplied by the positive valid seat count.
- [ ] Unsupported formats and invalid seat counts fail with typed errors before any state transition.
- [ ] Tuesday showtimes receive exactly 20% discount using half-up minor-unit rounding.
- [ ] Non-Tuesday showtimes receive zero discount.
- [ ] Identical fixture timestamps and subtotals produce identical results across host dates, locales, timezones, and supported operating systems.
- [ ] Domain modules import neither Commander.js nor filesystem APIs.
- [ ] Strict build, static validation, tests, and coverage gates pass.

### Verification Strategy

1. Table-driven request tests cover trimming, normalization, empty values, and duplicates.
2. Selection tests cover all-valid, nonexistent, sold, mixed, and immutable prior-state cases.
3. Pricing tests cover all formats, multiple seats, runtime unsupported formats, and invalid counts.
4. Discount tests cover Tuesday/non-Tuesday UTC timestamps and subtotals that exercise half-up rounding.
5. Application tests use counting fakes to prove invalid requests fail before repository reads and valid requests compose all rules.
6. Static inspection verifies domain files contain no Commander.js, filesystem, process, or console imports.

### Out of Scope

- Writing or atomically replacing `state.json`.
- Confirmation IDs and persisted purchase records.
- CLI commands, prompts, rendering, stdout/stderr, and exit codes.
- Real payments, accounts, multi-currency, dynamic pricing, coupons, and concurrent writers.
