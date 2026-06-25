# Implementation Plan for "Execution Documentation"

## Work Item

- Intent: `friccion-cero`
- Work item: `execution-documentation`
- Mode: `autopilot`
- Run: `run-codex-specsmd-fire-013`

## Approach

Create practical root-level documentation for the Friccion Cero MVP so a developer can install, configure, run, test, and continue development from a clean checkout. Keep the docs concise and actionable, while preserving the existing backend and frontend README files as module-level references.

## Implementation Checklist

- Add a root `friccion-cero/README.md` with:
  - product purpose and MVP scope
  - stack overview
  - prerequisites
  - backend setup and run commands
  - frontend setup and run commands
  - SQLite/database behavior and configuration
  - test commands
  - important technical decisions
  - known limitations
  - next-step ideas
- Update `friccion-cero/frontend/README.md` so it references actual project commands and API configuration instead of only Angular CLI boilerplate.
- Keep `friccion-cero/TESTING.md` as the dedicated test-command reference and link it from root docs.

## Files to Create

- `friccion-cero/README.md`

## Files to Modify

- `friccion-cero/frontend/README.md`

## Tests and Verification

- `npm run build` in backend
- `npm test` in backend
- `npm run build` in frontend
- `npm test -- --watch=false` in frontend

## Technical Decisions

- Use root README as the main developer entrypoint.
- Keep docs ASCII-only to match the project files.
- Avoid duplicating every detail from `TESTING.md`; link to it and summarize commands.

## Acceptance Mapping

- Backend setup/run command: root README.
- Frontend setup/run command: root README and frontend README.
- SQLite behavior/configuration: root README.
- Test commands: root README plus `TESTING.md`.
- Technical decisions: root README.
- Known limitations and next steps: root README.
