---
id: 002-receive-stable-output-and-errors
unit: 003-cli-application
intent: 001-cinema-ticket-purchase
status: complete
priority: must
created: 2026-06-19T20:34:24.000Z
assigned_bolt: 004-cli-application
implemented: true
---

# Story: 002-receive-stable-output-and-errors

## User Story

**As a** developer evaluating AI-DLC
**I want** stable output, errors, and exit codes
**So that** agent implementations can be compared automatically

## Acceptance Criteria

- [ ] **Given** a successful command, **When** it completes, **Then** deterministic results go to stdout and exit code is 0.
- [ ] **Given** expected validation, not-found, data, or persistence failure, **When** mapped, **Then** an actionable message goes to stderr with a stable non-zero code and no stack trace.
- [ ] **Given** identical fixtures, state, and explicit command input, **When** executed on supported platforms, **Then** required output fields and persisted-state semantics are equivalent.

## Technical Notes

Centralize typed error mapping and keep rendering independent from process-global streams for testing.

## Dependencies

### Requires
- 001-use-scriptable-commands

### Enables
- Construction completion and cross-agent comparison

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Output contains platform path | Normalize or omit it from required output |
| Unexpected error | Non-zero exit; stack shown only in explicit debug mode |

## Out of Scope

- Byte-for-byte cosmetic equivalence beyond required fields.
