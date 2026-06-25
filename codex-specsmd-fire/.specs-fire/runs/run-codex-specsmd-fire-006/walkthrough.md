# Walkthrough: Initiative API

## Endpoints

- `POST /api/frictions/:frictionId/initiatives` creates an initiative from an existing friction.
- `GET /api/initiatives` lists initiatives with basic friction context.
- `GET /api/initiatives/:id` returns initiative detail with friction context.
- `PUT /api/initiatives/:id` updates initiative fields.
- `DELETE /api/initiatives/:id` deletes an initiative.

## Behavior

When an initiative is created without an explicit priority, it inherits the priority calculated for the source friction. If priority is supplied in the request, that value is respected.

Initiative list and detail responses include the originating friction id and title so the frontend can display context without an extra lookup.

## Example Create Payload

```json
{
  "title": "Automate approval routing",
  "proposedSolution": "Create a workflow that routes approvals automatically.",
  "expectedReductionPercent": 70,
  "complexity": "medium",
  "status": "proposed"
}
```

## Verification

The backend build and the full Vitest suite pass with 23 tests.
