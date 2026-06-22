---
stage: plan
bolt: 003-ticket-purchase
created: 2026-06-19T21:30:03Z
---

## Implementation Plan: 003-ticket-purchase

### Objective

Turn a validated prepared purchase into one deterministic confirmation and one complete next-state document, then persist that document through a replace-safe JSON repository so sold seats, purchase history, and confirmation sequence survive later CLI executions together.

### Stories in Scope

1. **005-persist-completed-purchase**: Persist purchase data, sold seats, and the next confirmation sequence as one state transition while preserving the previous valid file on failure.
2. **006-receive-purchase-confirmation**: Generate, return, store, and reload a complete deterministic confirmation with a monotonic state-backed ID.

### Deliverables

1. Strongly typed purchase-record and confirmation values stored inside `CinemaState` instead of unvalidated `unknown` entries.
2. State JSON validation for every persisted purchase and pricing field.
3. A pure purchase-completion function that creates a deterministic confirmation ID, appends the record, marks seats sold, and increments sequence without mutating prior state.
4. A writable state-repository port extending the existing read boundary.
5. A local JSON state repository that initializes absent state, rejects malformed state, writes a temporary sibling file, and replaces the target only after a complete successful write.
6. Cleanup of temporary output after failed replacement without modifying the prior state file.
7. A purchase-completion application service that prepares, transitions, persists, and only then returns the confirmation.
8. Stage 3 tests for successful persistence, separate-process reload semantics, monotonic IDs, unchanged confirmations, missing state, malformed state, and injected write/replace failure.

### Planned Structure

```text
codex-specsmd/src/
  domain/
    purchase-completion.ts
    purchase-types.ts          # extended persisted/confirmation types
    catalog-types.ts           # typed CinemaState purchases
  application/
    complete-purchase.ts
    ports.ts                   # writable state repository
  infrastructure/
    json-state-repository.ts
    json-validation.ts         # persisted purchase validation
```

### Dependencies

1. **002-ticket-purchase**: Completed request, selection, pricing, discount, and preparation behavior.
2. **001-cinema-catalog**: Valid catalog types and JSON boundary conventions.
3. **Node.js filesystem and path APIs**: Temporary sibling writes and rename-based replacement.
4. **No new packages**: Standard Node primitives are sufficient.
5. **Single-writer boundary**: Concurrent writes to one state file remain explicitly out of scope.

### Technical Approach

1. Format confirmation IDs as `CIN-` plus a zero-padded persisted sequence, starting at `CIN-000001`.
2. Reject unsafe or exhausted sequence values before creating a next state.
3. Store the same structured confirmation object returned to the caller; do not separately re-render or regenerate it.
4. Copy prior purchases and sold-seat collections, merge newly sold seats in normalized request order, increment sequence, and leave all prior objects unchanged.
5. Validate the entire next state before writing it.
6. Treat a missing state file as a valid empty state with version 1, sequence 1, no sold seats, and no purchases.
7. Treat malformed existing state as a hard error and never overwrite it.
8. Serialize deterministic pretty JSON with a trailing newline.
9. Write to a fixed temporary sibling path under the single-writer assumption, then rename it over the target.
10. If temporary write or rename fails, remove temporary output best-effort, map the failure to a typed persistence error, and leave the previous target untouched.
11. Return confirmation only after repository save succeeds; rejected preparation or failed persistence creates no externally successful confirmation.

### Acceptance Criteria

- [ ] A valid prepared purchase produces a next state containing the complete purchase record, newly sold seats, and an incremented sequence.
- [ ] Confirmation contains ID, customer, movie, showtime, format, auditorium, seats, currency, unit price, subtotal, discount, and total.
- [ ] First ID is `CIN-000001`; successive committed purchases produce `CIN-000002`, then continue monotonically.
- [ ] Confirmation and persisted purchase record are structurally identical.
- [ ] Reloading the same state path preserves every confirmation field and sold seat.
- [ ] Multiple selected seats retain normalized stable order in confirmation and state.
- [ ] State transition does not mutate the prepared purchase or prior state snapshot.
- [ ] Missing state initializes a valid empty state.
- [ ] Malformed existing state fails without being overwritten.
- [ ] Temporary write or replacement failure returns a typed persistence error and preserves the previous valid target bytes.
- [ ] A rejected purchase or failed save does not persist a purchase, sell seats, or increment sequence.
- [ ] Strict build, static validation, tests, and coverage gates pass.

### Verification Strategy

1. Pure domain tests verify first and successive IDs, complete record fields, stable seat order, copies, and sequence exhaustion.
2. Repository tests use unique temporary directories to verify missing-state initialization, successful replacement, reload, malformed-state preservation, and deterministic JSON.
3. Injected filesystem-operation tests force temporary write and rename failures and compare target bytes before and after.
4. Application tests complete two purchases through the same repository and reload each confirmation from disk.
5. Failure tests prove no confirmation is returned and the existing state remains byte-for-byte unchanged.
6. The full suite re-runs all catalog, validation, pricing, and discount tests to detect regressions.

### Out of Scope

- Cross-process locking, transaction journals, and recovery after machine failure during rename.
- CLI commands, prompts, rendering, stdout/stderr, and exit codes.
- Confirmation delivery by email, PDF, API, or any remote service.
- Real payments, authentication, databases, multiple currencies, refunds, and cancellations.
