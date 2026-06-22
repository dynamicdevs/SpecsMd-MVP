---
id: 002-view-billboard
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 002-ticketing-cli
implemented: false
---

# Story: 002-view-billboard

## User Story

**As a** buyer
**I want** to see all movies currently showing
**So that** I can choose which movie to watch

## Acceptance Criteria

- [ ] **Given** movies exist in the data, **When** `billboard` is executed, **Then** lists all movies with ID, title, and available formats
- [ ] **Given** no movies exist, **When** `billboard` is executed, **Then** displays "No movies available"
- [ ] **Given** the command runs, **When** output is displayed, **Then** exit code is 0

## Technical Notes

- Command: `cinema billboard`
- Output format: one movie per line, human-readable
- Uses loadData internally

## Dependencies

### Requires
- 001-load-mock-data

### Enables
- User picks a movie ID for `showtimes` command
