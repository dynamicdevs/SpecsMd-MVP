# Coding Standards

## Overview

Code style and quality standards for this project.

---

## Formatting

- **Tool**: Prettier
- Indent: 2 spaces
- Semicolons: always
- Quotes: single
- Trailing commas: all
- Print width: 100

## Linting

- **Tool**: ESLint + typescript-eslint (strict config)
- No `any` — use `unknown` or proper types
- No unused variables
- Explicit return types on exported functions
- No console.log in domain layer (only in commands)

## Naming Conventions

| Element | Style | Example |
|---------|-------|---------|
| Variables & functions | camelCase | `calculatePrice`, `seatCount` |
| Types & interfaces | PascalCase | `Showtime`, `PurchaseResult` |
| Enums | PascalCase | `ScreenFormat` |
| Constants | UPPER_SNAKE_CASE | `BASE_PRICE_CENTS` |
| Files & folders | kebab-case | `seat-validation.ts` |
| Test files | `{name}.test.ts` | `seat-validation.test.ts` |

## File & Folder Organization

```
src/
├── domain/          # Pure business logic, no I/O
│   ├── types.ts     # Domain types and interfaces
│   ├── pricing.ts   # Price calculation
│   ├── validation.ts # Seat validation
│   ├── discount.ts  # Discount rules
│   └── confirmation.ts # Confirmation generation
├── commands/        # CLI command handlers
│   ├── billboard.ts
│   ├── showtimes.ts
│   ├── seats.ts
│   └── buy.ts
├── data/            # Mock data loaders
│   └── loader.ts
└── index.ts         # CLI entry point (Commander setup)
```

## Testing Strategy

- **Framework**: Vitest
- **Location**: Co-located `*.test.ts` files
- **Domain**: 100% unit test coverage expected
- **Commands**: Integration tests against fixture data
- **Pattern**: Arrange-Act-Assert
- **No mocks in domain** — domain is pure, no I/O to mock

## Error Handling

- Domain functions throw typed errors (custom Error subclasses)
- Commands catch domain errors and print user-friendly messages
- Exit code 1 on failure, 0 on success
- Never swallow errors silently

## Logging

- `console.log()` for user-facing output (commands only)
- `console.error()` for error messages
- No logging library needed for this scope
- Domain layer: NO console calls (pure functions only)

## General Principles

- Prefer immutable data (const, readonly)
- Functions over classes where possible
- Small, focused modules (single responsibility)
- No side effects in domain layer
- Types are documentation — descriptive names, no abbreviations
