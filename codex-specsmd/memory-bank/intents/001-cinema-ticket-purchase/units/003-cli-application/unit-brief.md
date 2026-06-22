---
unit: 003-cli-application
intent: 001-cinema-ticket-purchase
phase: inception
status: complete
unit_type: cli
default_bolt_type: simple-construction-bolt
created: 2026-06-19T20:34:24.000Z
updated: 2026-06-19T20:34:24.000Z
---

# Unit Brief: CLI Application

## Purpose

Expose cinema catalog and ticket-purchase capabilities through stable, scriptable Commander.js commands.

## Scope

### In Scope

- Program entry point and `movies`, `showtimes`, `seats`, and `buy` command adapters.
- Option parsing, optional guided purchase input, rendering, stderr, and exit-code mapping.
- npm scripts for build, test, coverage, and local execution.

### Out of Scope

- Catalog queries, purchase business rules, and JSON storage implementations.

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-10 | Provide stable CLI behavior | Must |

## Domain Concepts

| Entity | Description | Attributes |
|--------|-------------|------------|
| CommandRequest | Parsed terminal input | command, arguments, options |
| CommandResult | Renderable application result | output, error, exit code |

## Key Operations

| Operation | Inputs | Outputs |
|-----------|--------|---------|
| createProgram | Application dependencies | Configured Commander program |
| renderResult | Typed application result | Deterministic stdout text |
| mapError | Typed application error | stderr text and exit code |

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 2 |
| Must Have | 2 |
| Should Have | 0 |
| Could Have | 0 |

### Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| 001-use-scriptable-commands | Use scriptable commands | Must | Planned |
| 002-receive-stable-output-and-errors | Receive stable output and errors | Must | Planned |

## Dependencies

### Depends On

- `001-cinema-catalog`: Query use cases and result types.
- `002-ticket-purchase`: Purchase use case and confirmation result.

### Depended By

None.

### External Dependencies

- Commander.js and Node.js process streams; low risk.

## Technical Context

- Command adapters contain no pricing or seat rules.
- Dependencies and data paths are injectable for integration tests.
- Explicit options remain non-interactive and deterministic.

## Constraints

- Normal output uses stdout; errors use stderr.
- Success returns exit code 0 and expected failures return stable non-zero codes.
- Help is available for every public command.

## Success Criteria

- [ ] All four commands expose documented help and scriptable arguments.
- [ ] Explicit command invocations never prompt.
- [ ] Outputs, errors, and exit codes are stable and integration-tested.
- [ ] npm build and test scripts pass on supported platforms.

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| 004-cli-application | Simple | 001-002 | Integrate use cases behind stable Commander.js commands |
