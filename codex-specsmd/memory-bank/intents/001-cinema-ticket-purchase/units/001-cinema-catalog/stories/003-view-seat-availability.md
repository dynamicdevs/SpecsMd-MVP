---
id: 003-view-seat-availability
unit: 001-cinema-catalog
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 001-cinema-catalog
implemented: true
---

# Story: 003-view-seat-availability

## User Story

**As a** simulated cinema customer
**I want** to view available and sold seats for a showtime
**So that** I can choose seats that may be purchased

## Acceptance Criteria

- [ ] **Given** a known showtime, **When** availability is requested, **Then** every auditorium seat is returned in layout order and marked available or sold.
- [ ] **Given** sold seats in persisted state, **When** availability is requested in a later invocation, **Then** those seats remain sold.
- [ ] **Given** an unknown showtime ID, **When** queried, **Then** a typed not-found error is returned.

## Technical Notes

Normalize seat labels to uppercase and compute a read model without mutating catalog or state.

## Dependencies

### Requires
- 002-list-movie-showtimes

### Enables
- 002-ticket-purchase/002-validate-seat-selection

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| State references an unknown seat | Reject state as inconsistent |
| No seats are sold | Return every valid seat as available |

## Out of Scope

- Reserving or selling seats.
