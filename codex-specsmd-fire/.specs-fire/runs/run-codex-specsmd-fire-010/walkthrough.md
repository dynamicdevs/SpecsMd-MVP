# Walkthrough: Initiative Screens

## Routes

- `/initiatives` lists initiatives from `GET /api/initiatives`.
- `/initiatives/:id` loads detail from `GET /api/initiatives/:id`.
- `/frictions/:id` now includes an action to create an initiative through `POST /api/frictions/:frictionId/initiatives`.

## List Screen

The initiative list uses a PrimeNG table with title, related friction, expected reduction, complexity, priority, status, and a detail action.

## Detail Screen

The detail screen shows proposed solution, expected reduction, complexity, priority, status, and related friction context. It supports inline editing through the shared initiative form and deletion with confirmation.

## Friction Detail Integration

The friction detail screen opens a PrimeNG dialog for initiative creation. After a successful create, the friction detail is reloaded so related initiative counts update.

## Verification

The Angular build and test suite pass, production dependencies audit cleanly, and local initiative/friction routes respond from the dev server.
