# Coding Standards

## Overview

Lightweight, strict-but-practical standards for a small TypeScript CLI. The guiding principle is a **pure, framework-free domain**: all business logic (pricing, seat validation, discounts) lives in `src/domain` with no I/O, while Commander.js and console output live only in the command layer.

## Architecture Principle (Critical)

- **Keep domain logic pure and framework-free.** `src/domain` must contain only pure functions/types — no Commander.js, no `console`, no file/JSON reads.
- **Commander.js and console output live only in the command layer** (`src/commands`). Commands orchestrate: read data, call domain functions, print results.
- This keeps the domain fully unit-testable and portable across Claude Code, Codex, and Kiro.

## Code Formatting

**Tool**: Prettier (defaults)

**Key Settings**:
- Indentation: 2 spaces
- Quotes: single
- Semicolons: yes
- Trailing commas: multiline
- Line length: 100

**Enforcement**: Format on save / before commit.

## Linting

**Tool**: ESLint
**Base Config**: `@typescript-eslint/recommended`
**Strictness**: strict

**Key Rules**:
- `tsconfig` `strict: true` — full type safety
- No `any` — use `unknown` and narrow
- Unused variables: error
- No `console` inside `src/domain` (enforces the pure-domain rule)

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `seatId`, `isOccupied` |
| Functions | camelCase | `calculatePrice`, `validateSeat` |
| Classes | PascalCase | `SeatUnavailableError` |
| Interfaces / Types | PascalCase (no `I` prefix) | `Showtime`, `Seat`, `Format` |
| Constants | UPPER_SNAKE | `IMAX_SURCHARGE` |
| Booleans | `is`/`has`/`can` prefix | `isAvailable`, `hasDiscount` |

**File Naming**:
- All source/utility files: kebab-case (`seat-pricing.ts`)
- Tests: co-located, kebab-case + `.test.ts` (`seat-pricing.test.ts`)

## File Organization

**Pattern**: Type-based (small project)

**Structure**:
```text
src/
  commands/     # Commander.js commands + console I/O (only place with side effects)
  domain/       # Pure logic: pricing, seats, discounts (no I/O, no framework)
  data/         # JSON mock data + thin loaders
  index.ts      # CLI entry point (wires Commander)
```

**Conventions**:
- Tests: co-located next to the file under test as `*.test.ts`
- Types: co-located with the domain module that owns them
- Index files: only `src/index.ts` as the CLI entry; avoid barrel files elsewhere

## Testing Strategy

**Framework**: Vitest
**Coverage Target**: Critical domain paths — pricing (2D/3D/IMAX), occupied-seat validation, discount application, confirmation generation.

**Test Types**:

| Type | Tool | When to Use |
|------|------|-------------|
| Unit | Vitest | Domain functions (primary focus) |
| Integration | Vitest | Command-layer wiring against mock JSON |

**Conventions**:
- Test naming: `it('should …')`
- Test structure: Arrange–Act–Assert
- Mock strategy: mock only at the JSON-data boundary; domain functions run real

## Error Handling

**Pattern**: Throw typed custom errors from the domain (e.g. `SeatUnavailableError`); never print or exit inside the domain.

**Custom Errors**: Yes — small domain-specific error classes carrying enough context for a clear message.

**Command Layer**: Catches domain errors and prints a clean, user-facing message via `console.error`, setting a non-zero exit code on failure.

## Logging

**Tool**: Plain `console` (no logging library)
**Format**: text

**Levels**:

| Level | Usage |
|-------|-------|
| `console.log` | Normal user-facing CLI output (listings, confirmation) |
| `console.error` | Failures and validation errors |

**Rules**:
- Console usage is confined to the command layer (`src/commands`), never the domain.
- No sensitive data concerns — this is a local mock lab.
