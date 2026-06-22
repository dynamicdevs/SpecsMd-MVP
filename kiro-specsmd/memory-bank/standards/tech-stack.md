# Tech Stack

## Overview

Core technology decisions for this project.

---

## Languages

- **TypeScript** (strict mode)
- Target: ES2022
- Module system: ESM (Node16 module resolution)

## Framework

- **Commander.js** - CLI framework
- Subcommands: `billboard`, `showtimes`, `seats`, `buy`

## Build & Runtime

- **tsc** - TypeScript compiler → outputs to `dist/`
- **node** - Runtime execution from compiled JS
- No bundler needed for this scope

## Package Manager

- **npm** - Standard Node.js package manager

## Testing

- **Vitest** - Fast, TypeScript-native test runner
- Unit tests for domain logic
- Integration tests for CLI commands

## Key Dependencies

| Package | Purpose |
|---------|---------|
| typescript | Language |
| commander | CLI framework |
| vitest | Test runner |

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Language | TypeScript | Type safety for domain rules |
| CLI Framework | Commander.js | Mature, well-documented, minimal |
| Build | tsc + node | Simple, no bundler overhead |
| Package Manager | npm | Standard, no extra tooling |
| Test Runner | Vitest | Fast, native TS support |
