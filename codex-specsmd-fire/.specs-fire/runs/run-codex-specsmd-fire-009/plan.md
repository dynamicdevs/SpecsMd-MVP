# Implementation Plan: Friction Screens

## Work Item

`friction-screens` for intent `friccion-cero`.

## Approach

Replace the current friction placeholders with functional Angular screens connected to the existing backend API. Keep the implementation scoped to frictions only and reuse the frontend foundation from the previous run: standalone routed components, `FrictionApiService`, shared models, environment-based API URL, and PrimeNG components.

The screens will support:

- List frictions.
- Create friction.
- Edit friction.
- View friction detail with backend-calculated impact fields.
- Delete friction after explicit confirmation.

Derived fields such as monthly hours lost, estimated monthly cost, priority, category, and automation potential will be displayed from API responses only. The frontend will not recalculate them.

## Files to Create

- `friccion-cero/frontend/src/app/features/frictions/friction-options.ts`
  - Shared label/options helpers for frequencies, pain levels, statuses, categories, priorities, and automation potential.
- `friccion-cero/frontend/src/app/features/frictions/friction-formatters.ts`
  - Small display helpers for labels, numbers, currency, and severity mapping.
- `friccion-cero/frontend/src/app/features/frictions/friction-screens.spec.ts`
  - Focused tests for form validation and/or shell-level friction screen rendering where practical.

## Files to Modify

- `friccion-cero/frontend/src/app/features/frictions/frictions-page.component.ts`
  - Load frictions from API.
  - Render a PrimeNG table.
  - Show derived metrics and status/priority tags.
  - Provide actions for detail, edit, and delete.
- `friccion-cero/frontend/src/app/features/frictions/friction-form-page.component.ts`
  - Use Reactive Forms.
  - Support create and edit modes.
  - Validate required fields and numeric constraints.
  - Save through `FrictionApiService`.
- `friccion-cero/frontend/src/app/features/frictions/friction-detail-page.component.ts`
  - Load friction detail from API.
  - Show problem data and calculated impact.
  - Provide edit/delete actions.
- `friccion-cero/frontend/src/app/app.config.ts`
  - Add PrimeNG confirmation/toast providers if needed.
- `friccion-cero/frontend/src/app/app.html`
  - Add global confirm dialog and toast outlets if needed.
- `friccion-cero/frontend/src/app/core/models/friction.model.ts`
  - Add detail shape if needed for initiatives/comments included by the backend.
- `.specs-fire/intents/friccion-cero/work-items/friction-screens.md`
  - Mark acceptance criteria complete after verification.

## UI Details

- Use PrimeNG table, cards, buttons, tags, inputs, selects, textarea, input number, confirm dialog, and toast.
- Keep the interface dense and operational: no marketing sections.
- Use icon buttons for row actions where clear, with accessible labels.
- Empty/loading/error states will be visible and concise.

## Validation

Create/edit form will enforce:

- Title required.
- Description required.
- Area required.
- Frequency required.
- Time lost minutes >= 0.
- People affected >= 1.
- Pain level required.

## Tests and Verification

Run from `friccion-cero/frontend`:

- `npm run build`
- `npm test -- --watch=false`
- `npm audit --omit=dev`

Manual/local verification:

- Dev server responds on `http://127.0.0.1:4200/frictions`.
- Routes for list, new, detail, and edit compile and serve.

## Decisions

- Keep delete confirmation in the UI layer using PrimeNG `ConfirmationService`.
- Do not add state management libraries; service calls plus local component state are enough for the MVP.
- Keep comments/initiative creation outside this work item; detail may display returned comments/initiatives if present, but initiative workflows belong to later work items.
