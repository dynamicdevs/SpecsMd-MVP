---
id: 001-load-mock-data
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 002-ticketing-cli
implemented: false
---

# Story: 001-load-mock-data

## User Story

**As a** CLI tool
**I want** to load mock data from JSON files at startup
**So that** all commands have access to movies, showtimes, and seats data

## Acceptance Criteria

- [ ] **Given** valid JSON files exist, **When** loadData is called, **Then** returns typed DataStore with movies, showtimes, seats
- [ ] **Given** a JSON file is missing, **When** loadData is called, **Then** throws a clear error message
- [ ] **Given** a JSON file has invalid structure, **When** loadData is called, **Then** throws a descriptive error
- [ ] **Given** purchases.json exists, **When** loadData is called, **Then** seat statuses reflect previous purchases

## Technical Notes

- Data directory path should be configurable (for test isolation)
- Use synchronous reads (fs.readFileSync) — CLI tool, simplicity over async
- Parse and validate basic shape of data
- Merge purchase history into seat status on load

## Dependencies

### Requires
- None (first CLI story)

### Enables
- All other CLI stories (002-006)
