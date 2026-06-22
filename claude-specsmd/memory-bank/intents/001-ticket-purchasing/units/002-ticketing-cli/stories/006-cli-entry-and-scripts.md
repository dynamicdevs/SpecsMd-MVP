---
id: 006-cli-entry-and-scripts
unit: 002-ticketing-cli
intent: 001-ticket-purchasing
status: complete
priority: must
created: 2026-06-19T00:00:00.000Z
assigned_bolt: 003-ticketing-cli
implemented: true
---

# Story: 006-cli-entry-and-scripts

## User Story

**As a** CLI user (and as someone comparing three IDEs)
**I want** a single entry point and npm scripts for every command
**So that** the tool runs the same way across Claude Code, Codex, and Kiro

## Acceptance Criteria

- [ ] **Given** `src/index.ts`, **When** it runs, **Then** Commander wires the `billboard`, `showtimes`, `seats`, and `buy` commands with `--help`
- [ ] **Given** `package.json`, **When** I inspect scripts, **Then** there are npm scripts to run each command (e.g. `npm run billboard`, `npm run showtimes`, `npm run seats`, `npm run buy`)
- [ ] **Given** any command fails, **When** it exits, **Then** the process returns a non-zero exit code; on success it returns 0
- [ ] **Given** `npm test`, **When** I run it, **Then** Vitest executes the suite

## Technical Notes

- Entry point in `src/index.ts`; Commander program assembles commands from `src/commands/`.
- Keep scripts framework-free and runnable via `tsx`/compiled output per tech-stack.

## Dependencies

### Requires
- 002-view-billboard, 003-list-showtimes, 004-view-seats, 005-buy-tickets

### Enables
- None (final wiring)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Unknown command | Commander prints help + non-zero exit |
| No args | Prints help |

## Out of Scope

- Publishing / deployment (non-goals)
