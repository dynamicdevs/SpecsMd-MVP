---
id: 006-cli-entry-and-scripts
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: draft
priority: must
created: 2026-06-21T00:00:00Z
assigned_bolt: 003-ticketing-cli
implemented: false
---

# Story: 006-cli-entry-and-scripts

## User Story

**As a** user
**I want** a single CLI entry point with npm scripts for each command
**So that** I can run any command easily from the terminal

## Acceptance Criteria

- [ ] **Given** the project, **When** `npm run billboard` is executed, **Then** runs the billboard command
- [ ] **Given** the project, **When** `npm run showtimes -- --movie <id>` is executed, **Then** runs showtimes
- [ ] **Given** the project, **When** `npm run seats -- --showtime <id>` is executed, **Then** runs seats
- [ ] **Given** the project, **When** `npm run buy -- --showtime <id> --seats <s> --customer <n>` is executed, **Then** runs buy
- [ ] **Given** the project, **When** `npm test` is executed, **Then** runs Vitest
- [ ] **Given** no subcommand, **When** `cinema` is executed, **Then** shows help text

## Technical Notes

- Entry point: `src/index.ts` → compiled to `dist/index.js`
- Commander.js program with subcommands
- package.json scripts mapping to compiled output
- `"bin"` field optional but nice for local install

## Dependencies

### Requires
- All other CLI stories (002-005)

### Enables
- Full end-to-end usage of the tool
