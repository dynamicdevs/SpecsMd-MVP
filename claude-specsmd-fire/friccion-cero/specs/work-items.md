# Work Items — Fricción Cero

Descomposición incremental del MVP. Cada ítem se construyó y validó antes de pasar al siguiente.
Detalle por ítem en `../../.specs-fire/intents/friccion-cero/work-items/`.

## Backend

| # | Work item | Descripción | Estado |
|---|-----------|-------------|--------|
| 1 | `backend-scaffold` | Estructura FastAPI + SQLModel + SQLite, config, CORS, Swagger | ✅ |
| 2 | `backend-domain-model` | Entidades `Friction` e `Initiative` + enums | ✅ |
| 3 | `backend-impact-classification-priority` | Servicios de impacto, clasificación por reglas y priorización + tests | ✅ |
| 4 | `backend-frictions-crud` | Repositorio, servicio y endpoints CRUD de fricciones + `/classify` | ✅ |
| 5 | `backend-initiatives-crud` | CRUD de iniciativas + crear desde fricción | ✅ |
| 6 | `backend-dashboard` | Endpoint de métricas agregadas | ✅ |
| 7 | `backend-seed-swagger` | Seed de ejemplo, CORS, Swagger, valor hora configurable | ✅ |

## Frontend

| # | Work item | Descripción | Estado |
|---|-----------|-------------|--------|
| 8 | `frontend-scaffold` | Proyecto Angular + PrimeNG, routing, modelos y servicios HTTP | ✅ |
| 9 | `frontend-frictions` | Pantallas list / new / detail / edit con formularios reactivos | ✅ |
| 10 | `frontend-initiatives` | Pantallas list / detail + crear desde fricción | ✅ |
| 11 | `frontend-dashboard` | Dashboard con cards y tablas PrimeNG | ✅ |

## Documentación

| # | Work item | Descripción | Estado |
|---|-----------|-------------|--------|
| 12 | `docs-readme` | README + documentos `/specs` | ✅ |

## Orden de construcción

Backend primero (datos + lógica + API), verificado con tests unitarios y smoke test de endpoints;
luego frontend consumiendo la API real, verificado con `ng build`.
