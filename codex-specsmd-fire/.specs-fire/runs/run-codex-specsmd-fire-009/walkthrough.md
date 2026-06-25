# Walkthrough: Friction Screens

## Routes

- `/frictions` lists persisted frictions from `GET /api/frictions`.
- `/frictions/new` creates a friction through `POST /api/frictions`.
- `/frictions/:id` loads friction detail from `GET /api/frictions/:id`.
- `/frictions/:id/edit` updates a friction through `PUT /api/frictions/:id`.

## List Screen

The list uses a PrimeNG table with title, area, category, monthly hours, estimated cost, priority, status, and actions. Row actions support detail, edit, and delete.

## Form Screen

The form uses Reactive Forms and PrimeNG inputs. Required fields and numeric minimums are validated before saving. Create mode sends only the required user inputs; edit mode also allows category and automation potential edits.

## Detail Screen

The detail screen shows the problem description, priority/status tags, calculated impact, classification fields, and related counts for comments and initiatives returned by the backend.

## Delete Flow

Delete actions use PrimeNG confirmation before calling `DELETE /api/frictions/:id`.

## Verification

The Angular build and test suite pass, production dependencies audit cleanly, and local routes respond from the dev server.
