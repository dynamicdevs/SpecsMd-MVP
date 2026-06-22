# Coding Standards

## Overview

The codebase favors deterministic, strictly typed domain logic separated from Commander.js and filesystem adapters. Automated checks run through npm scripts and Vitest.

## TypeScript

- Enable strict TypeScript compiler options.
- Avoid `any`; use explicit domain types and `unknown` at untrusted boundaries.
- Validate parsed JSON before converting it into domain values.
- Represent money as integer minor units, never binary floating-point values.
- Keep functions focused and prefer immutable inputs and return values.

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables and functions | camelCase | `calculateTotal` |
| Classes and types | PascalCase | `PurchaseConfirmation` |
| Constants | UPPER_SNAKE_CASE | `TUESDAY_DISCOUNT_PERCENT` |
| Source files | kebab-case | `price-calculator.ts` |
| Test files | `.test.ts` suffix | `price-calculator.test.ts` |

Boolean names use prefixes such as `is`, `has`, or `can`. Collection names are plural.

## File Organization

```text
src/
  cli/
    commands/
  domain/
  application/
  infrastructure/
  index.ts
data/
  movies.json
  state.json
tests/
  fixtures/
```

- `domain/` contains pure rules and imports neither Commander.js nor filesystem APIs.
- `application/` coordinates use cases through explicit ports.
- `infrastructure/` implements JSON persistence.
- `cli/` parses input and renders output without owning business rules.
- Tests may be co-located or placed under `tests/`, but their naming must mirror behavior clearly.

## Testing Strategy

**Framework**: Vitest
**Coverage Target**: At least 80% overall and complete coverage of pricing, discount, seat validation, and purchase state transitions.

- Unit-test domain rules with table-driven cases.
- Integration-test commands against isolated temporary JSON state.
- Reset fixtures for every test; tests must not depend on execution order.
- Test observable behavior, outputs, exit codes, and persisted state.
- Include happy paths, invalid identifiers, duplicate seats, nonexistent seats, occupied seats, and persistence failures.

## Error Handling

- Use typed application errors with stable error codes for expected failures.
- Validate an entire purchase before modifying state.
- Translate expected errors into concise stderr messages and non-zero CLI exit codes.
- Do not expose stack traces unless debug behavior is explicitly enabled.
- Preserve the previous valid state if persistence fails.

## Output and Logging

- Normal command results go to stdout; diagnostics and errors go to stderr.
- Keep output deterministic and suitable for assertions.
- Do not log sensitive or irrelevant environment data.
- Avoid general logging unless it serves a defined diagnostic need.

## Automation

- `npm run build` performs the TypeScript build.
- `npm test` runs Vitest once.
- `npm run test:coverage` enforces coverage expectations.
- `npm start -- <command>` executes the CLI in the documented local workflow.
- CI, when used, runs build and tests without network-dependent application behavior.
