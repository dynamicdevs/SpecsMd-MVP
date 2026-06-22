---
stage: implement
bolt: 003-ticket-purchase
created: 2026-06-19T21:34:03Z
---

## Implementation Walkthrough: 003-ticket-purchase

### Summary

Implemented deterministic purchase completion and replace-safe local JSON persistence. A successful completion now creates one structured confirmation, appends that exact value to purchase history, marks all selected seats sold, increments the persisted sequence, and returns the confirmation only after the complete next state is saved.

### Structure Overview

The domain owns the immutable state transition and confirmation format. The application layer composes the existing preparation service with a writable state repository, while the infrastructure layer handles missing-state initialization, full persisted-record validation, deterministic serialization, temporary-file writing, replacement, and best-effort cleanup.

### Completed Work

- [x] `codex-specsmd/src/domain/purchase-types.ts` - Adds complete confirmation, persisted record, and completion result values.
- [x] `codex-specsmd/src/domain/catalog-types.ts` - Replaces unknown purchase entries with typed persisted records.
- [x] `codex-specsmd/src/domain/errors.ts` - Adds sequence exhaustion and state-write error codes.
- [x] `codex-specsmd/src/domain/purchase-completion.ts` - Produces monotonic IDs, complete confirmation records, sold-seat updates, purchase history, and the next sequence without mutation.
- [x] `codex-specsmd/src/application/ports.ts` - Adds the writable state repository contract.
- [x] `codex-specsmd/src/application/complete-purchase.ts` - Prepares, transitions, saves, and only then exposes a successful confirmation.
- [x] `codex-specsmd/src/infrastructure/json-state-repository.ts` - Initializes absent state and performs validated temporary-file replacement with typed failure mapping.
- [x] `codex-specsmd/src/infrastructure/json-validation.ts` - Validates every persisted confirmation field, monetary invariant, unique ID, and sequence relationship.
- [x] `codex-specsmd/src/domain/index.ts` - Exposes purchase completion behavior.
- [x] `codex-specsmd/src/index.ts` - Exposes the completion service and writable JSON repository.

### Key Decisions

- **One returned and stored value**: Confirmation and persisted purchase record are the same structured object.
- **State-backed monotonic IDs**: IDs use `CIN-` plus six digits and reject exhausted sequence values.
- **Immutable transition**: Prior state, preparation, arrays, and pricing values are not modified.
- **Full read/write validation**: Malformed prior state is rejected, and even typed next state is revalidated before serialization.
- **Replace-safe write**: A complete sibling temporary file is renamed over the target only after writing succeeds.
- **Failure before success**: A repository failure rejects the application operation, so no confirmation is returned as successful.
- **Single-writer temporary path**: The fixed sibling path matches the explicitly approved single-writer MVP boundary.

### Deviations from Plan

None. Cross-process locking and crash-recovery journaling remain out of scope as planned.

### Dependencies Added

None.

### Verification Performed

- [x] `npm run lint` completed successfully.
- [x] `npm run build` completed successfully.
- [x] Existing 74 tests remain passing after the persisted-state schema was strengthened.
- [x] No CLI behavior or remote dependency was introduced.

### Developer Notes

Stage 3 must exercise real replacement on the current Windows filesystem, inject both temporary-write and rename failures, reload successive confirmations, compare prior bytes after failure, and verify every persisted-field validator branch relevant to confirmation integrity.
