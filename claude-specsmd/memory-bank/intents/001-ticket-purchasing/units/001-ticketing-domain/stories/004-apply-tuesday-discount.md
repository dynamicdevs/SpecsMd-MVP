---
id: 004-apply-tuesday-discount
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 001-ticketing-domain
implemented: true
---

# Story: 004-apply-tuesday-discount

## User Story

**As a** customer buying tickets on a Tuesday
**I want** a 20% discount applied to my order
**So that** I get the advertised midweek deal

## Acceptance Criteria

- [ ] **Given** a showtime whose date is a Tuesday, **When** I apply the discount to a subtotal, **Then** discount = round(subtotal × 0.20) and total = subtotal − discount
- [ ] **Given** a showtime on any other day, **When** I apply the discount, **Then** discount = 0 and total = subtotal
- [ ] **Given** an injected clock/date, **When** the rule runs, **Then** the result is deterministic and independent of the real wall clock

## Technical Notes

- Pure function, e.g. `applyTuesdayDiscount(subtotalCents, showtimeDate): { discountCents, totalCents }`.
- "Tuesday" derived from the showtime's date; inject the date/clock for testability.
- Rounding rule must be explicit (e.g. round half-up) and documented so tests are stable.

## Dependencies

### Requires
- 001-define-domain-model, 003-calculate-format-price

### Enables
- 005-generate-confirmation (uses the final total)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Subtotal not divisible by 5 | Deterministic rounding to whole cents |
| Timezone ambiguity around midnight | Use showtime's own date field; documented |

## Out of Scope

- Other discounts (none in scope)
- Pricing itself (003)
