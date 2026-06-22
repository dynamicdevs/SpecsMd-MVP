---
id: 003-list-showtimes
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 002-ticketing-cli
implemented: false
---

# Story: 003-list-showtimes

## User Story

**As a** buyer
**I want** to see available showtimes for a specific movie
**So that** I can pick a convenient time and format

## Acceptance Criteria

- [ ] **Given** a valid movie ID, **When** `showtimes --movie <id>` is executed, **Then** lists all showtimes with ID, date, time, and format
- [ ] **Given** an invalid movie ID, **When** `showtimes --movie <id>` is executed, **Then** displays error and exit code 1
- [ ] **Given** --movie option is missing, **When** `showtimes` is executed, **Then** displays usage help and exit code 1

## Technical Notes

- Command: `cinema showtimes --movie <movieId>`
- Output: one showtime per line

## Dependencies

### Requires
- 001-load-mock-data

### Enables
- User picks a showtime ID for `seats` or `buy`
