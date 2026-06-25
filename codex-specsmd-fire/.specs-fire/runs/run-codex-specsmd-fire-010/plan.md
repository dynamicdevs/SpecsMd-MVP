# Implementation Plan: Initiative Screens

## Work Item

`initiative-screens` for intent `friccion-cero`.

## Approach

Replace initiative placeholders with functional Angular screens connected to the backend initiative API. Extend the friction detail screen so users can create an initiative directly from a friction, as required by the MVP.

The implementation will stay lightweight: component-local signals, Reactive Forms, existing API services, and PrimeNG components. No state management library will be introduced.

## Files to Create

- `friccion-cero/frontend/src/app/features/initiatives/initiative-options.ts`
  - Labels/options for status, complexity, and priority.
- `friccion-cero/frontend/src/app/features/initiatives/initiative-formatters.ts`
  - Formatting helpers and PrimeNG tag severities.
- `friccion-cero/frontend/src/app/features/initiatives/initiative-form.component.ts`
  - Reusable create/edit form for initiative tracking fields.
- `friccion-cero/frontend/src/app/features/initiatives/initiative-screens.spec.ts`
  - Focused validation/rendering tests for initiative form behavior.

## Files to Modify

- `friccion-cero/frontend/src/app/features/initiatives/initiatives-page.component.ts`
  - Load initiatives from API.
  - Render PrimeNG table with related friction context.
  - Link to detail and friction.
- `friccion-cero/frontend/src/app/features/initiatives/initiative-detail-page.component.ts`
  - Load detail from API.
  - Show proposed solution, expected reduction, complexity, priority, status, and friction context.
  - Allow editing status/core fields.
  - Allow delete with confirmation if aligned with current backend behavior.
- `friccion-cero/frontend/src/app/features/frictions/friction-detail-page.component.ts`
  - Add "Crear iniciativa" action and embedded creation form/dialog tied to the current friction.
  - Refresh friction detail after initiative creation so related counts update.
- `friccion-cero/frontend/src/app/core/models/initiative.model.ts`
  - Adjust detail/update types if needed.
- `.specs-fire/intents/friccion-cero/work-items/initiative-screens.md`
  - Mark acceptance criteria complete after verification.

## UI Details

- Use PrimeNG table, cards, buttons, tags, dialog, selects, textarea, input number, confirm dialog, and toast.
- Show friction context on initiative list/detail using the `friction` object returned by the backend.
- Keep tracking basic: status, complexity, priority, proposed solution, expected reduction percent.
- Use clear loading, empty, and error states.

## Validation

Initiative form will enforce:

- Title required.
- Proposed solution required.
- Expected reduction percent between 0 and 100.
- Complexity required.
- Status required when editing.
- Priority optional on create, editable on update.

## Tests and Verification

Run from `friccion-cero/frontend`:

- `npm run build`
- `npm test -- --watch=false`
- `npm audit --omit=dev`

Manual/local verification:

- `GET http://127.0.0.1:4200/initiatives`
- `GET http://127.0.0.1:4200/initiatives/example-id`
- Existing `/frictions/:id` route still compiles and includes initiative creation entry point.

## Decisions

- Create initiatives from friction detail via a PrimeNG dialog, not a separate route, because the backend creation endpoint is nested under a friction.
- Use the reusable initiative form for both creation and editing to avoid duplicated validation.
- Keep initiative delete available because the backend exposes `DELETE /api/initiatives/:id`.
