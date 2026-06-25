# Arquitectura — Fricción Cero

## Visión general

Aplicación cliente-servidor: una SPA Angular consume una API REST de FastAPI que persiste en
SQLite. La lógica de impacto, clasificación y priorización vive en el backend (single source of
truth); el frontend solo presenta y captura datos.

```
[Angular SPA + PrimeNG] --HTTP/JSON (camelCase)--> [FastAPI] --> [SQLModel] --> [SQLite]
```

## Backend (FastAPI)

Arquitectura en capas. Mapeo respecto a la separación pedida originalmente para .NET:

| Pedido (.NET) | Implementado (FastAPI) | Carpeta |
|---------------|------------------------|---------|
| Controllers | Routers REST | `app/api/` |
| Services | Lógica de negocio | `app/services/` |
| Repositories | Acceso a datos | `app/repositories/` |
| DTOs | Schemas Pydantic | `app/schemas/` |
| Entities | Modelos SQLModel | `app/models/` |

Flujo de una petición de creación de fricción:

```
POST /api/frictions
  → api/frictions.py (valida con FrictionCreate)
  → services/friction_service.py
       ├─ classification_service.suggest_category()  (si no se envió categoría)
       ├─ impact_service.calculate_monthly_hours_lost()
       ├─ impact_service.calculate_estimated_monthly_cost()
       └─ prioritization_service.determine_priority()
  → repositories/friction_repository.py (persistencia)
  → respuesta FrictionRead (camelCase)
```

**Servicios de negocio**:

- `impact_service`: fórmulas de horas y costo (valor hora configurable).
- `classification_service`: reglas de texto normalizadas (sin acentos, minúsculas).
- `prioritization_service`: umbrales de horas/costo + dolor + automatización → prioridad.
- `dashboard_service`: agregaciones para el dashboard.
- `seed_service`: datos de ejemplo si la DB está vacía.

**Persistencia**: SQLModel sobre SQLite. Migración del MVP por `SQLModel.metadata.create_all`
en el startup (Alembic queda como evolución futura). Migrable a Postgres cambiando
`FRICCION_DATABASE_URL`.

## Frontend (Angular + PrimeNG)

Organización por **feature**, con un `core/` compartido:

```
src/app/
├── core/
│   ├── models/      # Friction, Initiative, Dashboard, enums (camelCase, alineado al backend)
│   └── services/    # FrictionService, InitiativeService, DashboardService (HttpClient)
└── features/
    ├── dashboard/   # cards + tablas
    ├── frictions/   # list, form (new/edit), detail (+ convertir en iniciativa)
    └── initiatives/ # list, detail (editar)
```

- **Standalone components** con rutas lazy (`app.routes.ts`).
- **Formularios reactivos** (`ReactiveFormsModule`) para crear/editar.
- **Servicios HTTP separados** por recurso, apuntando a `environment.apiUrl`.
- **PrimeNG** para UI (tablas, cards, dropdowns, diálogos, toasts, confirmaciones).
- Sin store global: estado local por componente + servicios (suficiente para el MVP).

## Comunicación entre capas

- Contrato JSON en **camelCase**. El backend usa un `CamelModel` base (alias generator) para que
  los DTOs coincidan con los modelos TypeScript del frontend.
- **CORS** habilitado para `http://localhost:4200`.
- Los campos calculados (`monthlyHoursLost`, `estimatedMonthlyCost`, `priority`) son **solo
  lectura** en el frontend; siempre los produce el backend.

## Pantallas y rutas

| Ruta | Pantalla |
|------|----------|
| `/dashboard` | Métricas agregadas |
| `/frictions` | Listado de fricciones |
| `/frictions/new` | Crear fricción |
| `/frictions/:id` | Detalle (+ convertir en iniciativa) |
| `/frictions/:id/edit` | Editar fricción |
| `/initiatives` | Listado de iniciativas |
| `/initiatives/:id` | Detalle / editar iniciativa |

## Decisiones clave

| Decisión | Elección | Razón |
|----------|----------|-------|
| Backend | FastAPI + SQLModel (no .NET 8) | Pedido del usuario; Python disponible, .NET SDK no |
| Migraciones | `create_all` | MVP simple; esquema pequeño y estable |
| Cálculos | En backend | Single source of truth; el frontend solo muestra |
| Estructura | Monorepo `friccion-cero/{backend,frontend}` | Simplicidad fullstack |
| Estado frontend | Servicios + RxJS, sin store | Evitar sobreingeniería |
