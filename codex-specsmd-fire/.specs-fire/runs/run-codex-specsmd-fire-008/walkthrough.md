# Walkthrough: Frontend Foundation

## Location

Frontend application: `friccion-cero/frontend`

## Structure

- `src/app/core/models`: shared TypeScript contracts for frictions, initiatives, and dashboard data.
- `src/app/core/api`: HTTP services for backend endpoints.
- `src/app/features`: routed feature entry points for dashboard, frictions, and initiatives.
- `src/environments`: API base URL configuration.
- `src/app/app.*`: application shell and navigation.

## Routes

- `/dashboard`
- `/frictions`
- `/frictions/new`
- `/frictions/:id`
- `/frictions/:id/edit`
- `/initiatives`
- `/initiatives/:id`

## API Configuration

The frontend reads `environment.apiBaseUrl`, currently set to `http://localhost:3000`.

## Verification

The app builds, unit tests pass, production dependencies audit cleanly, and the dev server responds on `http://127.0.0.1:4200/dashboard`.
