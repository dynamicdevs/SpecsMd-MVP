---
id: 001-use-scriptable-commands
unit: 003-cli-application
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 004-cli-application
implemented: true
---

# Story: 001-use-scriptable-commands

## User Story

**As a** developer evaluating AI-DLC
**I want** scriptable cinema commands with help
**So that** implementations can be exercised consistently

## Acceptance Criteria

- [ ] **Given** the CLI, **When** help is requested, **Then** `movies`, `showtimes`, `seats`, and `buy` are documented with their arguments and options.
- [ ] **Given** complete explicit options, **When** a command executes, **Then** it never prompts for input.
- [ ] **Given** omitted purchase values in an interactive terminal, **When** guided mode is supported, **Then** it obtains the same request fields without changing domain behavior.

## Technical Notes

Create the Commander program through a factory with injected use cases, streams, and data paths.

## Dependencies

### Requires
- 001-cinema-catalog stories
- 002-ticket-purchase/006-receive-purchase-confirmation

### Enables
- 002-receive-stable-output-and-errors

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Noninteractive input lacks required option | Fail clearly without prompting |
| Unknown command | Show Commander help/error and non-zero exit |

## Out of Scope

- Business rules inside command handlers.
