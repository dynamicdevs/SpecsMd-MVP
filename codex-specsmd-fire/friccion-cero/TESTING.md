# Testing

This MVP has focused backend and frontend tests for calculation rules, API smoke behavior, and critical UI/service wiring.

## Backend

Run from `friccion-cero/backend`:

```bash
npm run build
npm test
npm audit --omit=dev
```

What this covers:

- friction impact calculations
- category, automation potential, and priority rules
- friction, initiative, dashboard, health, and docs API smoke tests
- Prisma repository behavior against the local test SQLite database

## Frontend

Run from `friccion-cero/frontend`:

```bash
npm run build
npm test -- --watch=false
npm audit --omit=dev
```

What this covers:

- application shell rendering
- friction and initiative form validation
- dashboard metrics, ranking, and empty state
- HTTP wiring for the main API services

## Notes

- Backend tests use Vitest and Supertest.
- Frontend tests use Angular's test runner with Vitest and HTTP testing utilities.
- Production dependency audits use `--omit=dev`. Full development audits may report Angular build-tool development advisories; they do not affect the production audit command above.
