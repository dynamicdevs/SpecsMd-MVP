# Fricción Cero

Aplicación fullstack para **registrar fricciones operativas**, **medir cuánto tiempo y dinero
hacen perder**, **clasificarlas**, **priorizarlas** y **convertirlas en iniciativas de mejora**,
con un dashboard de impacto.

Construida con la metodología **Specs.md FIRE** (Fast Intent-Run Engineering). La documentación
del proceso vive en [`/specs`](./specs) y en `../.specs-fire/`.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Angular 18 + PrimeNG 17 (formularios reactivos, servicios HTTP por feature) |
| Backend | FastAPI (Python 3.12) + SQLModel |
| Base de datos | SQLite |
| Docs API | Swagger / OpenAPI (`/docs`) |

> **Nota de decisión**: el backend originalmente sugerido era .NET 8. Se cambió a **FastAPI +
> Python** por pedido del usuario (y porque el .NET SDK no estaba instalado en el entorno).
> Las capas pedidas para .NET (Controllers/Services/Repositories/DTOs+Entities) se mapean a
> `api/` · `services/` · `repositories/` · `schemas/` + `models/`.

## Estructura

```
friccion-cero/
├── backend/                     # API FastAPI
│   └── app/
│       ├── core/                # config + database
│       ├── models/              # entidades SQLModel + enums
│       ├── schemas/             # DTOs (Pydantic, camelCase)
│       ├── repositories/        # acceso a datos
│       ├── services/            # impacto, clasificación, priorización, CRUD, dashboard, seed
│       └── api/                 # routers REST
├── frontend/friccion-cero-web/  # SPA Angular + PrimeNG
│   └── src/app/
│       ├── core/                # modelos + servicios HTTP
│       └── features/            # dashboard / frictions / initiatives
└── specs/                       # documentación Specs.md FIRE
```

## Requisitos

- Python 3.10+ (probado con 3.12)
- Node.js 18+ (probado con 24)

## Ejecutar el backend

```bash
cd backend

# 1. Crear entorno virtual e instalar dependencias
python -m venv .venv
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux/Mac:
# source .venv/bin/activate
pip install -r requirements.txt

# 2. (opcional) configurar el valor hora y otros ajustes
cp .env.example .env   # editar FRICCION_HOURLY_RATE si se desea

# 3. Levantar la API
uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000
- **Swagger**: http://localhost:8000/docs
- Al iniciar, si la base está vacía, se crean **5 fricciones de ejemplo** (seed).
- La base de datos SQLite `friccion_cero.db` se crea automáticamente.

### Tests del backend

```bash
cd backend
pytest        # 12 tests de impacto / clasificación / priorización
```

## Ejecutar el frontend

```bash
cd frontend/friccion-cero-web
npm install
npm start            # equivale a: ng serve
```

- App: http://localhost:4200
- El frontend consume la API real en `http://localhost:8000/api`
  (configurable en `src/environments/environment.ts`).
- **Importante**: levantar primero el backend; el frontend no usa datos mock.

### Build de producción

```bash
cd frontend/friccion-cero-web
npm run build        # genera dist/friccion-cero-web
```

## Funcionalidad del MVP

- **Fricciones**: crear, listar, ver detalle, editar, eliminar.
- **Cálculo automático de impacto** (en el backend al crear/editar):
  - `MonthlyHoursLost = TimeLostMinutes * Frequency * PeopleAffected / 60`
  - `EstimatedMonthlyCost = MonthlyHoursLost * HourlyRate` (valor hora configurable).
- **Clasificación por reglas** de texto (sin IA externa). Endpoint `POST /api/frictions/classify`
  y sugerencia automática al crear si no se envía categoría.
- **Priorización automática** (Baja/Media/Alta/Crítica) según horas, costo, dolor y automatización.
- **Iniciativas**: crear desde una fricción, listar, ver detalle, editar, eliminar.
- **Dashboard**: totales, distribución por categoría/prioridad, top 5 más costosas, iniciativas por estado.

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/frictions` | Listar fricciones |
| POST | `/api/frictions` | Crear fricción (calcula impacto/prioridad, sugiere categoría) |
| GET | `/api/frictions/{id}` | Detalle |
| PUT | `/api/frictions/{id}` | Editar |
| DELETE | `/api/frictions/{id}` | Eliminar |
| POST | `/api/frictions/classify` | Sugerir categoría por texto |
| GET/POST | `/api/initiatives` | Listar / crear iniciativa |
| GET/PUT/DELETE | `/api/initiatives/{id}` | Detalle / editar / eliminar |
| GET | `/api/dashboard` | Métricas agregadas |

## Configuración (backend)

Variables de entorno (prefijo `FRICCION_`), ver `backend/.env.example`:

- `FRICCION_HOURLY_RATE` — valor hora para el costo estimado (por defecto `20.0`).
- `FRICCION_DATABASE_URL` — por defecto `sqlite:///./friccion_cero.db`.
- `FRICCION_SEED_ON_STARTUP` — sembrar ejemplos si la DB está vacía (por defecto `true`).
