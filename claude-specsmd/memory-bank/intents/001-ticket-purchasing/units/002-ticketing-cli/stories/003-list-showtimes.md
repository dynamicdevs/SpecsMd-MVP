---
id: 003-list-showtimes
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 002-ticketing-cli
implemented: true
---

# Story: 003-list-showtimes

## User Story

**As a** CLI user
**I want** to list showtimes for a selected movie
**So that** I can choose when and in which format to watch

## Acceptance Criteria

- [ ] **Given** a valid movie ID, **When** I run `showtimes --movie=<id>`, **Then** it lists that movie's showtimes with showtime ID, date/time, format, and screen
- [ ] **Given** an unknown movie ID, **When** I run the command, **Then** it prints a clear error and exits non-zero
- [ ] **Given** a movie with no showtimes, **When** I run the command, **Then** it prints a friendly "no showtimes" message

## Technical Notes

- Command in `src/commands/`; reads from the loaded dataset.
- Unknown-ID handling lives here (user-facing), distinct from domain errors.

## Dependencies

### Requires
- 001-load-mock-data

### Enables
- 004-view-seats (user picks a showtime ID)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Missing `--movie` arg | Clear error + non-zero exit |
| Unknown movie ID | Clear error + non-zero exit |

## Out of Scope

- Seat display and purchase (other stories)
