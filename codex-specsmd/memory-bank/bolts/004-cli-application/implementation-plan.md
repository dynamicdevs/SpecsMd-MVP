---
stage: plan
bolt: 004-cli-application
created: 2026-06-19T21:40:28Z
---

## Implementation Plan: 004-cli-application

### Objective

Expose the completed catalog and purchase use cases through a deterministic Commander.js CLI whose explicit commands are automation-friendly, whose optional guided purchase follows the same application path, and whose output, errors, exit codes, and local JSON persistence behave consistently across Windows, macOS, and Linux.

### Stories in Scope

1. **001-use-scriptable-commands**: Provide documented `movies`, `showtimes`, `seats`, and `buy` commands; complete explicit input must never prompt, while an interactive purchase may collect omitted values.
2. **002-receive-stable-output-and-errors**: Keep successful output on stdout, expected failures on stderr, and map domain, data, persistence, Commander, and unexpected errors to stable exit codes without leaking stacks unless debug mode is explicit.

### Deliverables

1. A Commander.js program factory with injected catalog, purchase, I/O, terminal capability, and prompt dependencies.
2. Four public commands: `movies`, `showtimes <movie-id>`, `seats <showtime-id>`, and `buy` with scriptable purchase options.
3. Deterministic text renderers for catalog results, seat availability, and complete purchase confirmation.
4. Optional guided input for omitted `buy` fields using Node's built-in readline support only when stdin is interactive.
5. Central typed error mapping with stable process exit codes and optional debug stack output.
6. A thin executable composition root that resolves local data files portably and delegates all business behavior to existing services.
7. npm scripts and concise usage documentation for building, testing, and running the CLI offline.
8. Stage 3 unit, integration, and spawned-process tests using isolated, resettable JSON fixtures.

### Planned Structure

```text
codex-specsmd/
  src/
    cli/
      program.ts
      renderers.ts
      error-mapping.ts
      prompts.ts
      runtime.ts
      main.ts
  tests/
    cli/
      program.test.ts
      renderers.test.ts
      error-mapping.test.ts
      process.test.ts
  README.md
```

The exact file split may be consolidated during implementation where a smaller module remains clearer, but the program factory, rendering, error mapping, and process composition boundaries remain separate responsibilities.

### Dependencies

1. **001-cinema-catalog**: Completed deterministic movie, showtime, and availability queries.
2. **003-ticket-purchase**: Completed validated, priced, persisted purchase and confirmation flow.
3. **Commander.js**: Command definition, help, argument parsing, and parse errors.
4. **Node.js standard library**: Process streams, readline, URL, and path resolution.
5. **No new runtime packages**: The existing declared stack is sufficient.

### Technical Approach

1. Build the Commander program through `createProgram(dependencies)` so tests can supply fake writers, terminal state, prompt behavior, and isolated repositories without mutating process globals.
2. Keep command handlers orchestration-only: parse presentation input, call one application service, render its result, and write it to the injected output.
3. Define `buy --name <customer> --showtime <id> --seats <seat-list>`; parse comma-separated seats into the existing request shape and let domain normalization and validation remain authoritative.
4. If every purchase option is explicit, bypass prompt code unconditionally. If values are missing and the injected terminal is interactive, request only missing fields. Otherwise raise a typed CLI input error listing the missing options.
5. Render stable line-oriented records with fixed field labels and ordering; omit filesystem paths and locale-dependent formatting.
6. Render confirmation fields in a fixed order including confirmation ID, customer, movie, showtime, format, auditorium, seats, subtotal, discount, total, and currency.
7. Map input, validation, unknown identifier, and seat failures to exit code 2; catalog/state data failures to 3; persistence failures to 4; and unexpected or Commander usage failures to 1 unless Commander semantics require the defined usage code. The implementation will encode the final mapping as named constants and tests will lock it down.
8. Convert all expected errors to one actionable stderr line without a stack. Include unexpected stack details only when explicit debug mode is enabled.
9. Compose repositories and services once in the executable entry point. Resolve default `data/catalog.json` and `data/state.json` relative to the application root through URL/path APIs, not the caller's working directory.
10. Permit test-only data-path injection through the runtime boundary so process tests never read or alter the committed state fixture.
11. Update `npm start` to execute the CLI entry point; retain strict build, lint, test, and coverage scripts.

### Acceptance Criteria

- [ ] Root help documents `movies`, `showtimes`, `seats`, and `buy`.
- [ ] Command-specific help documents required arguments and purchase options.
- [ ] `movies`, `showtimes`, and `seats` return deterministic application data on stdout with exit code 0.
- [ ] A complete explicit `buy` never invokes a prompt and persists one valid purchase.
- [ ] Interactive missing purchase fields are collected and passed through the same purchase service.
- [ ] Noninteractive missing purchase fields fail clearly without waiting for stdin.
- [ ] Confirmation output includes every required business field in stable order.
- [ ] Expected failures use stable nonzero exit codes, stderr only, and no stack trace.
- [ ] Unexpected failures expose a stack only under explicit debug mode.
- [ ] User-visible required output contains no platform-specific paths or locale-dependent values.
- [ ] The default state persists between CLI executions; tests use isolated resettable files.
- [ ] Strict build, static validation, full tests, and coverage gates pass.

### Verification Strategy

1. Program-factory tests inject spies for output, errors, prompts, and services to verify command wiring without process globals.
2. Help tests lock down all public command names, arguments, and options.
3. Renderer tests verify exact field ordering and stable formatting for movies, showtimes, seats, and confirmation values.
4. Buy tests prove explicit options do not prompt, interactive omissions request only missing fields, and noninteractive omissions fail immediately.
5. Error-mapping tests cover typed input, domain, data, persistence, Commander, and unexpected failures with and without debug mode.
6. Integration tests use temporary catalog and state files to exercise real repositories and services, including successful persistence and sold-seat rejection.
7. Spawned-process smoke tests run the npm/CLI entry point with injected temporary paths and assert stdout, stderr, exit status, and persistence across separate executions.
8. The full existing 102-test suite runs unchanged to catch domain and infrastructure regressions.

### Out of Scope

- Business rules inside CLI handlers or renderers.
- Rich terminal UI, seat maps, colors, localization, or shell-specific completion.
- Remote APIs, authentication, real payments, databases, web frontends, and deployment.
- Byte-for-byte equivalence of nonessential whitespace across independent agent implementations.
