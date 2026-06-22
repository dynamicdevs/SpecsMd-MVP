---
id: 005-generate-confirmation
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 001-ticketing-domain
implemented: true
---

# Story: 005-generate-confirmation

## User Story

**As a** customer who completed a purchase
**I want** a confirmation summarizing my booking
**So that** I have a record of the movie, seats, and amount paid

## Acceptance Criteria

- [ ] **Given** a valid, priced order and a customer name, **When** I generate a confirmation, **Then** it includes movie title, showtime, seats, customer name, total amount, and a confirmation ID
- [ ] **Given** the same order and the same seed/inputs, **When** I generate a confirmation twice, **Then** the confirmation ID is identical (deterministic)
- [ ] **Given** an invalid order, **When** I attempt to generate a confirmation, **Then** generation does not proceed (validation/pricing must have succeeded first)

## Technical Notes

- Pure function, e.g. `generateConfirmation(order, customerName, seed): Confirmation`.
- Deterministic ID: derive from order fields + seed (e.g. hash) rather than random UUID, so tests are reproducible.

## Dependencies

### Requires
- 001-define-domain-model, 002-validate-seat-selection, 003-calculate-format-price, 004-apply-tuesday-discount

### Enables
- 005-buy-tickets (CLI unit prints this confirmation)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Multiple seats | All seat codes listed in confirmation |
| Empty customer name | Rejected upstream by the buy command; domain receives a non-empty name |

## Out of Scope

- Console formatting of the confirmation (CLI unit)
- Persisting the confirmation anywhere
