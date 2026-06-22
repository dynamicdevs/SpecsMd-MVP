---
id: 001-define-domain-types
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 001-ticketing-domain
implemented: false
---

# Story: 001-define-domain-types

## User Story

**As a** developer
**I want** well-defined domain types for movies, showtimes, seats, and purchases
**So that** all domain functions operate on a clear, typed contract

## Acceptance Criteria

- [ ] **Given** the domain module, **When** imported, **Then** exports Movie, Showtime, Seat, SeatStatus, ScreenFormat, Purchase, and Confirmation types
- [ ] **Given** money values, **When** represented, **Then** they are integers in centavos (never floats)
- [ ] **Given** ScreenFormat, **When** defined, **Then** includes "2D", "3D", "IMAX"
- [ ] **Given** SeatStatus, **When** defined, **Then** includes "free" and "sold"

## Technical Notes

- Use TypeScript interfaces/types, not classes
- Money is always `number` representing centavos
- ScreenFormat and SeatStatus as union types or enums

## Dependencies

### Requires
- None (foundational)

### Enables
- All other domain stories (002-005)
