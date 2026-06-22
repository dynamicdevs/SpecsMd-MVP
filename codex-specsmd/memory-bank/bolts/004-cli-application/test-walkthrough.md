---
stage: test
bolt: 004-cli-application
created: 2026-06-19T21:48:10Z
---

## Test Report: cli-application

### Summary

- **Tests**: 121/121 passed
- **Test files**: 15/15 passed
- **Coverage**: 95.14% lines, 95.31% statements, 95.14% functions, 89.44% branches
- **Build**: Passed
- **Strict static validation**: Passed

### Test Files

- [x] `codex-specsmd/tests/cli-renderers.test.ts` - Verifies stable catalog, showtime, seat, money, and complete confirmation rendering.
- [x] `codex-specsmd/tests/cli-error-mapping.test.ts` - Verifies fixed exit categories, path sanitization, Commander failures, and debug-only unexpected stacks.
- [x] `codex-specsmd/tests/cli-program.test.ts` - Verifies help, all commands, stdout/stderr, explicit and guided purchases, missing options, and service errors through injected dependencies.
- [x] `codex-specsmd/tests/cli-process.test.ts` - Verifies real cross-process purchase persistence and sold-seat rejection with isolated temporary JSON files.
- [x] `codex-specsmd/tests/*.test.ts` - Re-runs the complete catalog, selection, pricing, discount, confirmation, validation, and persistence regression suite.

### Acceptance Criteria Validation

- ✅ **Root help documents every public command**: `movies`, `showtimes`, `seats`, and `buy` are present.
- ✅ **Command help documents arguments and purchase options**: Movie/showtime identifiers and all three buy options are covered.
- ✅ **Read commands produce deterministic stdout and code 0**: Exact required fields and ordering are asserted.
- ✅ **Complete explicit purchases never prompt**: Prompt spy remains untouched and the normalized request reaches the purchase service.
- ✅ **Interactive omissions use guided input**: Only missing fields are requested and the same purchase service is called.
- ✅ **Noninteractive omissions fail immediately**: The CLI returns code 2 on stderr without invoking input.
- ✅ **Confirmations include all required values**: ID, customer, movie, showtime, format, auditorium, seats, prices, discount, total, and currency are asserted.
- ✅ **Expected failures are stable and stack-free**: Input, domain, data, persistence, and Commander categories are covered.
- ✅ **Unexpected details require debug mode**: Generic output is the default; stack detail is enabled only explicitly.
- ✅ **Required output is platform-neutral**: Renderers use fixed ISO timestamps and labels; infrastructure paths are sanitized.
- ✅ **Persistence survives separate executions**: A spawned purchase is visible to a later spawned seat query and in the isolated state file.
- ✅ **Tests never alter committed state**: Every writable process test uses a unique temporary directory; `data/state.json` remains unchanged.
- ✅ **All quality gates pass**: Build, strict TypeScript validation, full suite, and configured coverage thresholds succeed.

### Issues Found

Two initial test assertions were too literal: one mistook text within `showtime` for a stack frame and one expected alternative sold-seat wording. Both assertions were corrected to validate the actual stable contract; no production defect was present.

### Notes

Process tests invoke Node directly with the TypeScript loader and inject temporary paths through the documented environment boundary. This exercises the real executable composition without relying on shell-specific syntax or built artifacts.
