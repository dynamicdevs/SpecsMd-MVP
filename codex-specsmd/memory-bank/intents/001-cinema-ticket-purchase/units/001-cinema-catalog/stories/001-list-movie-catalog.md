---
id: 001-list-movie-catalog
unit: 001-cinema-catalog
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 001-cinema-catalog
implemented: true
---

# Story: 001-list-movie-catalog

## User Story

**As a** simulated cinema customer
**I want** to list the mock movie catalog
**So that** I can decide which movie to explore

## Acceptance Criteria

- [ ] **Given** a valid catalog, **When** movies are requested, **Then** every movie is returned in fixture order with stable ID, title, and optional classification.
- [ ] **Given** an empty catalog, **When** movies are requested, **Then** a successful explicit empty result is returned.
- [ ] **Given** unreadable or invalid JSON, **When** the catalog is loaded, **Then** a typed data error is returned without partial results.

## Technical Notes

Validate JSON at the adapter boundary and keep catalog queries pure and presentation-neutral.

## Dependencies

### Requires
- None

### Enables
- 002-list-movie-showtimes

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Duplicate movie IDs | Reject the catalog as invalid |
| Missing optional classification | Return the movie without inventing a value |

## Out of Scope

- Rendering terminal output and querying showtimes.
