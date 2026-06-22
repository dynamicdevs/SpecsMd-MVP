---
id: 003-calculate-format-pricing
unit: 002-ticket-purchase
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 002-ticket-purchase
implemented: true
---

# Story: 003-calculate-format-pricing

## User Story

**As a** simulated cinema customer
**I want** the subtotal calculated from presentation format and seat count
**So that** my ticket price is correct and predictable

## Acceptance Criteria

- [ ] **Given** a 2D, 3D, or IMAX showtime, **When** pricing seats, **Then** each seat costs 800, 1100, or 1500 minor units respectively.
- [ ] **Given** multiple valid seats, **When** priced, **Then** subtotal equals unit price multiplied by seat count.
- [ ] **Given** an unsupported format, **When** priced, **Then** a typed error is returned before mutation.

## Technical Notes

Use integer minor units and a pure table-driven pricing function.

## Dependencies

### Requires
- 002-validate-seat-selection

### Enables
- 004-apply-tuesday-discount

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Zero seats reaches calculator | Reject invariant violation |
| Locale uses comma decimal | Internal result remains unchanged |

## Out of Scope

- Dynamic pricing and multiple currencies.
