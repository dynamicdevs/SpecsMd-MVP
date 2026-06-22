---
id: 004-apply-tuesday-discount
unit: 002-ticket-purchase
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 002-ticket-purchase
implemented: true
---

# Story: 004-apply-tuesday-discount

## User Story

**As a** simulated cinema customer
**I want** an eligible Tuesday discount applied
**So that** my final total follows the advertised rule

## Acceptance Criteria

- [ ] **Given** a Tuesday showtime, **When** the total is calculated, **Then** 20% of subtotal is deducted using half-up minor-unit rounding.
- [ ] **Given** a non-Tuesday showtime, **When** calculated, **Then** discount is zero.
- [ ] **Given** the same showtime and subtotal, **When** run on any supported OS or current date, **Then** subtotal, discount, and total are identical.

## Technical Notes

Determine weekday from the fixture date under a documented date representation, never from the system clock.

## Dependencies

### Requires
- 003-calculate-format-pricing

### Enables
- 005-persist-completed-purchase

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Fractional minor-unit discount | Round half-up |
| Host timezone differs | Eligibility remains fixture-defined |

## Out of Scope

- Coupons and stacked discounts.
