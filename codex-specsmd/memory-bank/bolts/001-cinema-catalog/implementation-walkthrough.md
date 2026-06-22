---
stage: implement
bolt: 001-cinema-catalog
created: 2026-06-19T20:47:09Z
---

## Implementation Walkthrough: 001-cinema-catalog

### Summary

Created the independent `codex-specsmd` TypeScript project and implemented the complete read-only cinema catalog unit. The implementation validates all untrusted JSON before use, preserves fixture ordering, exposes presentation-neutral query services, and combines auditorium layouts with persisted sold-seat state.

### Structure Overview

The project separates immutable domain values and availability rules from application query orchestration and filesystem adapters. Local JSON files remain boundary resources, while application services depend on injected repository interfaces so later CLI commands and tests can choose their own paths.

### Completed Work

- [x] `codex-specsmd/package.json` - Defines npm lifecycle, strict validation, build, test, coverage, and project dependencies.
- [x] `codex-specsmd/package-lock.json` - Locks the independently installed dependency graph.
- [x] `codex-specsmd/tsconfig.json` - Enforces strict Node ESM TypeScript compilation.
- [x] `codex-specsmd/vitest.config.ts` - Establishes Node test execution and coverage thresholds for Stage 3.
- [x] `codex-specsmd/data/catalog.json` - Supplies deterministic movies, showtimes, formats, auditoriums, and seats.
- [x] `codex-specsmd/data/state.json` - Supplies persistent sold-seat state without coupling reads to purchase behavior.
- [x] `codex-specsmd/src/domain/catalog-types.ts` - Defines trusted cinema catalog and state values.
- [x] `codex-specsmd/src/domain/errors.ts` - Defines stable typed application errors.
- [x] `codex-specsmd/src/domain/seat-availability.ts` - Projects ordered available and sold seats and rejects inconsistent state.
- [x] `codex-specsmd/src/application/ports.ts` - Defines injected read boundaries.
- [x] `codex-specsmd/src/application/catalog-queries.ts` - Provides movie, showtime, and availability use cases.
- [x] `codex-specsmd/src/infrastructure/json-validation.ts` - Validates untrusted catalog and state documents completely.
- [x] `codex-specsmd/src/infrastructure/json-catalog-repository.ts` - Reads catalog JSON and maps boundary failures to typed errors.
- [x] `codex-specsmd/src/infrastructure/json-state-reader.ts` - Reads persistent state through an injectable path.
- [x] `codex-specsmd/src/domain/index.ts` - Exposes the domain surface for later units.
- [x] `codex-specsmd/src/index.ts` - Exposes the project modules without introducing CLI behavior early.

### Key Decisions

- **Independent application directory**: `codex-specsmd` keeps Codex output isolated from `claude-specsmd` for fair comparison.
- **Focused manual boundary validation**: The fixed laboratory schema does not justify another runtime dependency.
- **Closed presentation formats**: Unsupported values fail during catalog loading rather than leaking into pricing later.
- **Fixture-order preservation**: Query output remains deterministic and avoids locale-sensitive sorting.
- **Injected paths and ports**: Filesystem behavior can be tested with isolated files and replaced without changing domain rules.
- **Compiler-based lint gate**: Strict TypeScript with additional safety flags serves as the Stage 2 static validation gate without adding a linter dependency.

### Deviations from Plan

None. Every planned source and configuration responsibility was implemented. Test files remain intentionally deferred to Stage 3 as required by the bolt workflow.

### Dependencies Added

- [x] `commander` - Reserved for the planned CLI integration unit; unused by catalog domain code.
- [x] `typescript` - Strict compilation and static validation.
- [x] `vitest` - Stage 3 unit and adapter testing.
- [x] `@vitest/coverage-v8` - Coverage measurement and thresholds.
- [x] `tsx` - Local TypeScript execution for the later CLI entry point.
- [x] `@types/node` - Typed cross-platform Node.js filesystem APIs.

### Verification Performed

- [x] Dependency installation completed with zero reported vulnerabilities.
- [x] `npm run build` completed successfully.
- [x] `npm run lint` completed successfully under strict compiler rules.
- [x] No source files under `claude-specsmd` were changed or reused.

### Developer Notes

Stage 3 should emphasize invalid JSON shapes and cross-reference failures in addition to normal query behavior. Purchase mutation and Commander.js presentation remain deliberately outside this bolt.
