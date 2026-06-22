---
unit: 001-cinema-catalog
intent: 001-cinema-ticket-purchase
phase: inception
status: complete
unit_type: cli
default_bolt_type: simple-construction-bolt
created: 2026-06-19T20:34:24.000Z
updated: 2026-06-19T20:34:24.000Z
---

# Unit Brief: Cinema Catalog

## Purpose

Provide validated, deterministic read-only access to mock movies, showtimes, auditorium layouts, and persisted seat availability.

## Scope

### In Scope

- Load and validate catalog JSON.
- Query movies and showtimes in fixture order.
- Combine auditorium layouts with sold-seat state to project availability.

### Out of Scope

- Purchase mutation, pricing, discounting, and confirmation.
- Commander.js rendering and process exit behavior.

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-1 | List the movie catalog | Must |
| FR-2 | List available showtimes | Must |
| FR-3 | Display current seat availability | Must |

## Domain Concepts

| Entity | Description | Attributes |
|--------|-------------|------------|
| Movie | A mock cinema title | ID, title, classification |
| Showtime | A scheduled presentation | ID, movie ID, date/time, auditorium, format |
| Auditorium | Defines valid seats | ID, ordered seat labels |
| SeatAvailability | Read model for one showtime | seat ID, availability status |

## Key Operations

| Operation | Inputs | Outputs |
|-----------|--------|---------|
| listMovies | Valid catalog | Ordered movies |
| listShowtimes | Movie ID, catalog | Ordered showtimes or not-found error |
| getSeatAvailability | Showtime ID, catalog, state | Ordered seat availability |

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 3 |
| Must Have | 3 |
| Should Have | 0 |
| Could Have | 0 |

### Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| 001-list-movie-catalog | List movie catalog | Must | Planned |
| 002-list-movie-showtimes | List movie showtimes | Must | Planned |
| 003-view-seat-availability | View seat availability | Must | Planned |

## Dependencies

### Depends On

None.

### Depended By

- `002-ticket-purchase`: Consumes validated catalog and showtime concepts.
- `003-cli-application`: Renders catalog query results.

### External Dependencies

- Mock catalog JSON and local state JSON; both are local and low risk.

## Technical Context

- Strict TypeScript and injected JSON readers.
- Return typed results; never print or exit from this unit.
- Preserve fixture ordering and normalize seat identifiers consistently.

## Constraints

- No network calls or database.
- Invalid JSON is rejected at the adapter boundary.
- Read operations do not mutate fixture or state files.

## Success Criteria

- [ ] Movies, showtimes, and seats are queryable with deterministic ordering.
- [ ] Missing identifiers and malformed data produce typed errors.
- [ ] Availability includes persisted sold seats.
- [ ] Tests cover empty data and invalid identifiers.
- [ ] Coverage is at least 80%.

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| 001-cinema-catalog | Simple | 001-003 | Implement validated catalog and availability queries |
