---
stage: implement
bolt: 004-cli-application
created: 2026-06-19T21:44:50Z
---

## Implementation Walkthrough: cli-application

### Summary

The application now exposes the completed cinema catalog and purchase behavior through four documented Commander.js commands. Its presentation boundary supports deterministic output, optional guided purchase input, stable typed failure mapping, portable local-data resolution, and dependency injection for isolated command and process verification.

### Structure Overview

The CLI is divided into a program factory, deterministic renderers, prompt adapter, failure translator, runtime composition root, and executable entry point. Command handlers remain thin and delegate all catalog, seat, pricing, discount, confirmation, and persistence behavior to the pre-existing application services.

### Completed Work

- [x] `codex-specsmd/src/cli/program.ts` - Defines the four commands, their help, explicit purchase options, guided-input boundary, and injected command orchestration.
- [x] `codex-specsmd/src/cli/renderers.ts` - Produces stable line-oriented catalog, showtime, seat, and confirmation output.
- [x] `codex-specsmd/src/cli/error-mapping.ts` - Translates expected and unexpected failures into concise messages and named exit codes.
- [x] `codex-specsmd/src/cli/prompts.ts` - Provides the optional interactive readline adapter.
- [x] `codex-specsmd/src/cli/runtime.ts` - Composes repositories and services with portable default paths and injectable streams, paths, and terminal behavior.
- [x] `codex-specsmd/src/cli/main.ts` - Runs the CLI and applies its resulting process exit code.
- [x] `codex-specsmd/src/index.ts` - Exposes the CLI boundaries alongside the existing application modules.
- [x] `codex-specsmd/package.json` - Routes the start script to the executable CLI entry point.
- [x] `codex-specsmd/README.md` - Documents offline setup, every command, persistence, and validation scripts.

### Key Decisions

- **Injected Commander factory**: Streams, services, terminal capability, and prompts can be replaced without changing process globals or production behavior.
- **Single application path for purchases**: Explicit and guided input both call the same completed purchase service, preserving one source of business truth.
- **Stable error categories**: Input and domain failures, local-data failures, persistence failures, and unexpected failures have distinct fixed exit codes.
- **Sanitized infrastructure failures**: User-facing data and persistence messages omit filesystem paths, while unexpected stacks require explicit debug mode.
- **Module-relative defaults**: Catalog and state paths resolve from the application location and do not depend on the invoking shell's working directory.

### Deviations from Plan

The process-level data-path injection remains a direct runtime API rather than an environment-variable interface. This keeps production commands smaller while still allowing Stage 3 process harnesses to use an explicit wrapper with isolated files.

### Dependencies Added

- [x] None - Commander.js and all required Node.js facilities were already available.

### Developer Notes

The committed state file is the production-local persistence target. Stage 3 CLI tests must always inject temporary catalog and state files and must never mutate that fixture.
