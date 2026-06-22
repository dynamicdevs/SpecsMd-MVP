---
id: 002-view-billboard
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 002-ticketing-cli
implemented: true
---

# Story: 002-view-billboard

## User Story

**As a** CLI user
**I want** to view the movie billboard
**So that** I can see which movies are available and their IDs

## Acceptance Criteria

- [ ] **Given** mock data with movies, **When** I run the `billboard` command, **Then** it lists every movie with at least ID and title
- [ ] **Given** the listing, **When** it prints, **Then** the format(s) for each movie are shown
- [ ] **Given** the command succeeds, **When** it finishes, **Then** it exits with code 0

## Technical Notes

- Command in `src/commands/`; uses the loader from 001-load-mock-data.
- Console output only in the command layer; no business rules here.

## Dependencies

### Requires
- 001-load-mock-data

### Enables
- 003-list-showtimes (user picks a movie ID from the billboard)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty billboard | Prints a friendly "no movies" message, exit 0 |

## Out of Scope

- Showtimes / seats / purchase (other stories)
