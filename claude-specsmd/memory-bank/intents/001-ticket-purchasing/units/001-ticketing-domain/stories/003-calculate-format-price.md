---
id: 003-calculate-format-price
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 001-ticketing-domain
implemented: true
---

# Story: 003-calculate-format-price

## User Story

**As a** customer buying tickets
**I want** the price computed from the showtime format
**So that** I pay the correct amount for 2D, 3D, or IMAX seats

## Acceptance Criteria

- [ ] **Given** N seats at a **2D** showtime, **When** I price the order, **Then** subtotal = N × base ($10.00)
- [ ] **Given** N seats at a **3D** showtime, **When** I price the order, **Then** subtotal = N × (base + $3.00)
- [ ] **Given** N seats at an **IMAX** showtime, **When** I price the order, **Then** subtotal = N × (base + $6.00)
- [ ] **Given** any format, **When** I price, **Then** the result is in integer cents and IMAX surcharge > 3D surcharge

## Technical Notes

- Pure function, e.g. `priceSeats(format, seatCount, pricing): number /* cents */`.
- Pricing config: base = 1000, 3D surcharge = 300, IMAX surcharge = 600 (cents). Keep configurable/injectable.

## Dependencies

### Requires
- 001-define-domain-model

### Enables
- 004-apply-tuesday-discount (operates on the subtotal)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Zero seats | Error or subtotal 0 (defined deterministically) |
| Large seat count | Linear, no overflow at lab scale |

## Out of Scope

- Discount application (004)
- Choosing the format (comes from the showtime)
