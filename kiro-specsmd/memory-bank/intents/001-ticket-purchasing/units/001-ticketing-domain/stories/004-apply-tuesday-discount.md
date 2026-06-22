---
id: 004-apply-tuesday-discount
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 001-ticketing-domain
implemented: false
---

# Story: 004-apply-tuesday-discount

## User Story

**As a** buyer
**I want** to get a 20% discount when the showtime is on Tuesday
**So that** I save money on off-peak days

## Acceptance Criteria

- [ ] **Given** a showtime on Tuesday and subtotal 10000, **When** applyDiscount is called, **Then** returns 8000 (20% off)
- [ ] **Given** a showtime on Monday, **When** applyDiscount is called, **Then** returns the subtotal unchanged
- [ ] **Given** a showtime on any non-Tuesday day, **When** applyDiscount is called, **Then** returns subtotal unchanged
- [ ] **Given** the discount is applied, **When** result is inspected, **Then** it is an integer (no floating point)

## Technical Notes

- Function signature: `applyDiscount(subtotal: number, showtimeDate: string): { total: number; discountApplied: boolean; discountAmount: number }`
- Date is passed as ISO string (from showtime data), NOT from Date.now()
- Use Math.round to avoid floating point issues after percentage calc
- The day is determined from the date string of the showtime

## Dependencies

### Requires
- 001-define-domain-types

### Enables
- Used by buy flow (after pricing, before confirmation)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Subtotal is 0 | Returns 0, no discount text |
| Date string is invalid | Throws error |
