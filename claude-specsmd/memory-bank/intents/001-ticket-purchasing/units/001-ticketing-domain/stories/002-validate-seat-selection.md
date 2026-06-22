---
id: 002-validate-seat-selection
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 001-ticketing-domain
implemented: true
---

# Story: 002-validate-seat-selection

## User Story

**As a** customer buying tickets
**I want** my seat selection rejected if any seat is invalid or taken
**So that** I never partially book or pay for an unavailable seat

## Acceptance Criteria

- [ ] **Given** a showtime and requested seat codes, **When** all seats exist and are available, **Then** validation passes
- [ ] **Given** a requested seat code that does not exist in the showtime, **When** I validate, **Then** a typed error is thrown naming the offending seat(s)
- [ ] **Given** a requested seat that is already sold, **When** I validate, **Then** a typed error is thrown naming the sold seat(s) and no seats are reserved (all-or-nothing)
- [ ] **Given** duplicate seat codes in the request, **When** I validate, **Then** the duplicate is rejected with a clear error

## Technical Notes

- Pure function, e.g. `validateSeatSelection(showtime, requestedCodes): void | throws`.
- Define typed errors such as `UnknownSeatError` and `SeatUnavailableError` carrying the offending codes.
- All-or-nothing: validation must consider the entire set before accepting any.

## Dependencies

### Requires
- 001-define-domain-model

### Enables
- 005-generate-confirmation (only valid selections proceed)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty seat list | Error: at least one seat required |
| Mixed valid + one sold | Whole selection rejected (all-or-nothing) |
| Case/format variations (b4 vs B4) | Normalized consistently or rejected; deterministic |

## Out of Scope

- Pricing of the validated seats (003)
- Reading seat availability from JSON (CLI unit)
