---
id: 001-load-mock-data
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 002-ticketing-cli
implemented: true
---

# Story: 001-load-mock-data

## User Story

**As a** CLI user
**I want** the tool to load movies, showtimes, and seats from local JSON
**So that** every command operates on consistent, deterministic mock data

## Acceptance Criteria

- [ ] **Given** the bundled mock JSON files, **When** the loader runs, **Then** it returns a typed dataset of movies, showtimes, and seat layouts
- [ ] **Given** a malformed or missing JSON file, **When** the loader runs, **Then** it fails with a clear user-facing error and non-zero exit
- [ ] **Given** unchanged JSON, **When** the loader runs repeatedly, **Then** it returns identical data (deterministic)

## Technical Notes

- Place loaders in `src/data/`; mock JSON under `src/data/` (e.g. `movies.json`, `showtimes.json`, `seats.json`).
- Parse into the domain types from 001-ticketing-domain; validate shape at the boundary.
- This is the only place that touches the file system.

## Dependencies

### Requires
- 001-ticketing-domain/001-define-domain-model (types)

### Enables
- 002-view-billboard, 003-list-showtimes, 004-view-seats, 005-buy-tickets

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| File not found | Clear error + non-zero exit |
| Invalid JSON / wrong shape | Validation error naming the file |

## Out of Scope

- Business rules (domain unit)
- Rendering data to console (other stories)
