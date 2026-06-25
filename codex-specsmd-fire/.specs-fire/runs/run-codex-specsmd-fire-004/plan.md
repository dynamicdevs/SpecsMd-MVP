---
run: run-codex-specsmd-fire-004
work_item: calculation-classification-services
intent: friccion-cero
mode: confirm
checkpoint: plan
approved_at: null
---

# Implementation Plan: Calculation and Classification Services

## Approach

Implement explicit, centralized backend services for impact calculation, category classification, automation potential, and priority. These services will be pure TypeScript functions/classes with unit tests, so later API work items can reuse them without duplicating formulas in controllers.

Service structure:

```text
src/services/
  friction-impact.service.ts
  friction-classification.service.ts
  friction-priority.service.ts
  friction-enrichment.service.ts
  friction-rules.test.ts
```

Responsibilities:

- `friction-impact.service.ts`: monthly hours and monthly cost formulas.
- `friction-classification.service.ts`: keyword/rule-based category and automation potential.
- `friction-priority.service.ts`: score-based priority suggestion.
- `friction-enrichment.service.ts`: one reusable function to enrich incoming friction inputs with derived values.

## Files to Create

| File | Purpose |
|------|---------|
| `friccion-cero/backend/src/services/friction-impact.service.ts` | Calculates monthly hours lost and estimated monthly cost. |
| `friccion-cero/backend/src/services/friction-classification.service.ts` | Classifies friction category and automation potential with simple heuristics. |
| `friccion-cero/backend/src/services/friction-priority.service.ts` | Suggests priority from impact, pain, and automation potential. |
| `friccion-cero/backend/src/services/friction-enrichment.service.ts` | Central orchestration for derived friction fields. |
| `friccion-cero/backend/src/services/friction-rules.test.ts` | Unit tests for formulas, classification, automation potential, priority, and enrichment. |

## Files to Modify

| File | Changes |
|------|---------|
| `friccion-cero/backend/src/dtos/friction.dto.ts` | Optionally adjust create/update DTOs so derived fields can be omitted by API consumers and filled by services. |
| `.specs-fire/intents/friccion-cero/work-items/calculation-classification-services.md` | Mark acceptance criteria complete after implementation. |

## Tests

| Test File | Coverage |
|-----------|----------|
| `friccion-cero/backend/src/services/friction-rules.test.ts` | Covers formulas, category rules, automation potential rules, priority scoring, and enrichment output. |
| Existing backend tests | Ensure app and repository behavior still passes. |
| `(command) npm run build` | Verifies TypeScript compiles. |
| `(command) npm test` | Verifies all backend tests pass. |

## Technical Details

### Formulas

Monthly hours lost:

```text
timeLostMinutes * monthlyFrequency * peopleAffected / 60
```

Frequency conversion:

| Frequency | Monthly multiplier |
|-----------|--------------------|
| daily | 22 |
| weekly | 4 |
| monthly | 1 |
| occasional | 0.5 |

Estimated monthly cost:

```text
monthlyHoursLost * hourlyCost
```

`hourlyCost` defaults to `env.DEFAULT_HOURLY_COST`.

### Classification

Rules use lowercased title + description + area text and keyword groups:

- `manual_repetitive_work`: repetitive, manual, copy, paste, spreadsheet, recurring.
- `third_party_waiting`: wait, blocked, dependency, third party, vendor.
- `data_duplication`: duplicate, duplicated, double entry, re-enter, repeated data.
- `unnecessary_meetings`: meeting, sync, call, standup.
- `manual_approvals`: approval, approve, signature, authorization, validation.
- `missing_system_integration`: integration, disconnected, export, import, no sync.
- `excessive_information_search`: search, find, lookup, where is, information.
- `recurring_human_errors`: error, mistake, rework, correction, typo.
- `lack_of_traceability`: traceability, status, audit, tracking, visibility.

Fallback: `unclassified`.

### Automation Potential

High:

- `manual_repetitive_work`
- `data_duplication`
- `manual_approvals`
- `missing_system_integration`

Medium:

- `excessive_information_search`
- `recurring_human_errors`
- `lack_of_traceability`

Low:

- `unnecessary_meetings`
- `third_party_waiting`
- `unclassified`

### Priority

Use a small score:

- Monthly hours: high >= 40, medium >= 10.
- Estimated monthly cost: high >= 2000, medium >= 500.
- Pain: low 0, medium 1, high 2.
- Automation potential: low 0, medium 1, high 2.

Suggested priority:

- `high` if score >= 6, or pain is high with either high hours/cost.
- `medium` if score >= 3.
- `low` otherwise.

The thresholds are simple MVP defaults and can be tuned later.

---
*Plan awaiting checkpoint approval.*
