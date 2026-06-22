---
id: 002-validate-seat-selection
unit: 001-ticketing-domain
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 001-ticketing-domain
implemented: false
---

# Story: 002-validate-seat-selection

## User Story

**As a** buyer
**I want** the system to validate my seat selection before purchasing
**So that** I don't end up with invalid or already-sold seats

## Acceptance Criteria

- [ ] **Given** valid free seats, **When** validateSeats is called, **Then** returns success
- [ ] **Given** a seat ID that doesn't exist, **When** validateSeats is called, **Then** returns error indicating invalid seat
- [ ] **Given** a seat that is already sold, **When** validateSeats is called, **Then** returns error indicating seat occupied
- [ ] **Given** a mix of valid and invalid seats, **When** validateSeats is called, **Then** rejects ALL seats (all-or-nothing)
- [ ] **Given** an empty seat selection, **When** validateSeats is called, **Then** returns error (must select at least one)

## Technical Notes

- Function signature: `validateSeats(selectedIds: string[], availableSeats: Seat[]): ValidationResult`
- Return a discriminated union: `{ valid: true, seats: Seat[] } | { valid: false, error: string }`
- Pure function, no I/O

## Dependencies

### Requires
- 001-define-domain-types (Seat, SeatStatus types)

### Enables
- Used by buy command in CLI unit

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty array | Error: "Must select at least one seat" |
| Duplicate seat IDs | Treat as single seat (dedup) |
| All seats sold | Error listing first unavailable seat |
