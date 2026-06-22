---
id: 001-submit-purchase-request
unit: 002-ticket-purchase
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 002-ticket-purchase
implemented: true
---

# Story: 001-submit-purchase-request

## User Story

**As a** simulated cinema customer
**I want** to submit my name, showtime, and seats
**So that** the application can attempt my purchase

## Acceptance Criteria

- [ ] **Given** a nonblank customer, showtime ID, and seats, **When** submitted, **Then** a normalized purchase request is produced.
- [ ] **Given** a blank customer or empty seat list, **When** submitted, **Then** validation fails before state access.
- [ ] **Given** repeated seat IDs with different casing, **When** submitted, **Then** the request is rejected as duplicated.

## Technical Notes

Keep request validation independent from Commander.js and normalize seat labels once.

## Dependencies

### Requires
- None

### Enables
- 002-validate-seat-selection

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Whitespace-only customer | Reject |
| Seats `a1` and `A1` | Reject as duplicate |

## Out of Scope

- Interactive prompting and persistence.
