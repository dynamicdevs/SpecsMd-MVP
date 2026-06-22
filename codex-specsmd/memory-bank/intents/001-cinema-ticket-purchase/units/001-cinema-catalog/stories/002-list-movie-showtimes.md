---
id: 002-list-movie-showtimes
unit: 001-cinema-catalog
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 001-cinema-catalog
implemented: true
---

# Story: 002-list-movie-showtimes

## User Story

**As a** simulated cinema customer
**I want** to list showtimes for a movie
**So that** I can choose a presentation and format

## Acceptance Criteria

- [ ] **Given** a known movie, **When** its showtimes are requested, **Then** each result includes stable ID, date/time, auditorium, and `2D`, `3D`, or `IMAX` format in fixture order.
- [ ] **Given** an unknown movie ID, **When** showtimes are requested, **Then** a typed not-found error is returned.
- [ ] **Given** a known movie with no showtimes, **When** queried, **Then** a successful explicit empty result is returned.

## Technical Notes

Parse fixture dates consistently and reject unsupported formats during catalog validation.

## Dependencies

### Requires
- 001-list-movie-catalog

### Enables
- 003-view-seat-availability

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Unsupported format | Reject invalid fixture data |
| Multiple showtimes at same time | Preserve each stable showtime ID |

## Out of Scope

- Seat state and price calculation.
