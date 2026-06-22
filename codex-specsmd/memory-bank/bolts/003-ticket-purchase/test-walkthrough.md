---
stage: test
bolt: 003-ticket-purchase
created: 2026-06-19T21:37:13Z
---

## Test Report: 003-ticket-purchase

### Summary

- **Test Files**: 11/11 passed
- **Tests**: 102/102 passed
- **New Persistence Tests**: 28 passed
- **Statements**: 98.97%
- **Branches**: 98.08%
- **Functions**: 100%
- **Lines**: 98.93%
- **Build**: Passed
- **Static Validation**: Passed
- **Windows File Replacement**: Passed

### Test Files

- [x] `codex-specsmd/tests/purchase-completion.test.ts` - Complete confirmation fields, stable seat order, immutable transition, first/successive IDs, and exhausted sequence.
- [x] `codex-specsmd/tests/persisted-state-validation.test.ts` - Confirmation schema, UTC timestamps, formats, seats, money, currency, unique IDs, and sequence relationships.
- [x] `codex-specsmd/tests/json-state-repository.test.ts` - Missing-state initialization, real Windows replacement, reload, deterministic bytes, malformed state, write failure, rename failure, cleanup failure, and invalid next state.
- [x] `codex-specsmd/tests/complete-purchase.test.ts` - Two purchases across one state path, reloaded confirmations, rejected selections, save failure, and prior-byte preservation.
- [x] All seven earlier catalog, request, selection, pricing, and discount test files remain passing.

### Acceptance Criteria Validation

- ✅ **Complete next state**: Purchase record, sold seats, and incremented sequence are created together.
- ✅ **Complete confirmation**: ID, customer, movie, showtime, format, auditorium, seats, currency, unit price, subtotal, discount, and total are present.
- ✅ **Monotonic IDs**: First two committed IDs are `CIN-000001` and `CIN-000002`; persisted sequence advances to 3.
- ✅ **Stored and returned identity**: Reloaded purchase records are structurally identical to returned confirmations.
- ✅ **Cross-execution persistence**: Separate loads from the same path retain confirmations and sold seats.
- ✅ **Stable seat order**: Multiple normalized seats retain request order in confirmation and state.
- ✅ **Immutable transition**: Preparation and prior state remain deeply unchanged.
- ✅ **Missing-state initialization**: A nonexistent file yields an independent valid empty state.
- ✅ **Malformed-state preservation**: Invalid existing bytes are rejected and remain unchanged.
- ✅ **Write-failure preservation**: Injected temporary-write failure leaves prior target bytes unchanged.
- ✅ **Rename-failure preservation**: Injected replacement failure leaves prior target bytes unchanged and removes temporary output.
- ✅ **Cleanup-failure handling**: Best-effort cleanup cannot hide the original typed persistence failure.
- ✅ **Rejected purchase behavior**: Invalid seats never invoke save and never create a successful confirmation.
- ✅ **Failed-save behavior**: No confirmation is returned as successful and prior bytes remain unchanged.
- ✅ **Quality gates**: Strict build, static validation, full suite, and coverage thresholds pass.

### Issues Found

No implementation defects remain. The real filesystem replacement test passed on the current Windows environment.

### Notes

The unit now provides a complete offline purchase operation behind application services. Commander.js integration, human-readable rendering, stdout/stderr mapping, and public command execution remain assigned to `004-cli-application`.
