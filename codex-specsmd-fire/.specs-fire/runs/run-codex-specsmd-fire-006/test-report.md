# Test Report: run-codex-specsmd-fire-006

## Scope

Work item: `initiative-api`

## Commands

- `DATABASE_URL=file:./test.db npm run build`
- `DATABASE_URL=file:./test.db npm test`

## Results

- TypeScript build: passed.
- Vitest suite: passed.
- Test files: 5 passed.
- Tests: 23 passed.

## Coverage Added

- Initiative creation from an existing friction.
- Initiative priority inheritance from the source friction.
- Initiative list with friction context.
- Initiative detail retrieval.
- Initiative update.
- Initiative delete.
- Missing friction 404.
- Initiative validation errors.

## Notes

Vitest file parallelism is disabled because the current backend test suite uses one SQLite test database and resets it between tests.
