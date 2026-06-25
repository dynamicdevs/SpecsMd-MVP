# 🔥 Fricción Cero

**Plataforma para detectar, registrar, medir y priorizar fricciones operativas.**

Permite a equipos y empresas cuantificar el impacto real de ineficiencias (trabajo manual, esperas, duplicación, errores) y convertirlas en iniciativas de mejora con seguimiento.

---

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 18 + PrimeNG 17 |
| Backend | Python 3.11+ + FastAPI |
| Base de datos | SQLite (via SQLAlchemy 2.0) |
| Tests | pytest (33 tests) |

---

## Estructura del Proyecto

```
kiro-specsmd-fire/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings (.env)
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── models/              # Entidades (Friction, Initiative, Comment)
│   │   ├── schemas/             # DTOs Pydantic (request/response)
│   │   ├── routers/             # Endpoints API
│   │   └── services/            # Lógica de negocio
│   ├── tests/                   # pytest tests
│   ├── requirements.txt
│   └── .env
├── frontend/
│   └── src/app/
│       ├── core/services/       # HTTP services
│       ├── features/            # Pantallas
│       └── shared/models/       # Interfaces TypeScript
└── .specs-fire/                 # Artefactos FIRE
```

---

## Requisitos Previos

- **Python 3.11+** ([descargar](https://www.python.org/downloads/))
- **Node.js 18+** ([descargar](https://nodejs.org/))
- **npm** (viene con Node.js)

---

## Instalación y Ejecución

### Backend

```bash
cd backend
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (macOS/Linux)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor de desarrollo
uvicorn app.main:app --reload --port 8000
```

El backend estará disponible en:
- **API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Frontend

```bash
cd frontend
npm install
npx ng serve
```

El frontend estará disponible en:
- **App**: http://localhost:4200

---

## API Endpoints

### Health

| Method | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

### Fricciones

| Method | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/frictions` | Listar todas |
| GET | `/api/v1/frictions/{id}` | Obtener por ID |
| POST | `/api/v1/frictions` | Crear (calcula campos automáticamente) |
| PUT | `/api/v1/frictions/{id}` | Actualizar (recalcula) |
| DELETE | `/api/v1/frictions/{id}` | Eliminar |
| GET | `/api/v1/frictions/{id}/comments` | Listar comentarios |
| POST | `/api/v1/frictions/{id}/comments` | Agregar comentario |
| GET | `/api/v1/frictions/{id}/initiatives` | Iniciativas de una fricción |

### Iniciativas

| Method | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/initiatives` | Listar todas |
| GET | `/api/v1/initiatives/{id}` | Obtener por ID |
| POST | `/api/v1/initiatives` | Crear (requiere friction_id válido) |
| PUT | `/api/v1/initiatives/{id}` | Actualizar |
| DELETE | `/api/v1/initiatives/{id}` | Eliminar |

### Dashboard

| Method | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/dashboard` | Métricas agregadas |

---

## Configuración

Variables de entorno en `backend/.env`:

```env
DATABASE_URL=sqlite:///./friccion_cero.db
HOURLY_RATE=25.0              # Valor hora para cálculo de costo
HIGH_COST_THRESHOLD=500.0     # Umbral para prioridad alta ($/mes)
HIGH_HOURS_THRESHOLD=20.0     # Umbral para prioridad alta (horas/mes)
```

---

## Reglas de Negocio

### Cálculos Automáticos

| Campo | Fórmula |
|-------|---------|
| `monthly_hours_lost` | (minutos × frecuencia × personas) / 60 |
| `estimated_monthly_cost` | horas_mensuales × valor_hora |
| `automation_potential` | Basado en categoría (ver tabla) |
| `priority` | Basado en costo, horas y dolor |

### Potencial de Automatización

| Categoría | Potencial |
|-----------|-----------|
| Trabajo manual repetitivo | **Alto** |
| Duplicación de datos | **Alto** |
| Aprobaciones manuales | **Alto** |
| Falta de integración | **Alto** |
| Búsqueda excesiva | Medio |
| Errores humanos | Medio |
| Espera/dependencia | Bajo |
| Reuniones innecesarias | Bajo |
| Falta de trazabilidad | Bajo |

### Priorización

| Condición | Prioridad |
|-----------|-----------|
| Costo > $500/mes O Horas > 20/mes O Dolor ≥ 4 | **Alta** |
| Costo < $125/mes Y Horas < 5/mes Y Dolor ≤ 2 | Baja |
| Resto | Media |

---

## Casos de Prueba — Backend (API)

> **Prerrequisito**: Backend corriendo en `http://localhost:8000`.
> Puedes usar Swagger UI (`http://localhost:8000/docs`) para ejecutar visualmente.

### CP-01: Health Check

```bash
curl http://localhost:8000/api/health
```

**Esperado**: `{"status": "ok", "service": "friccion-cero-api"}`

---

### CP-02: Crear Fricción — Trabajo Repetitivo (Prioridad Alta)

```bash
curl -X POST http://localhost:8000/api/v1/frictions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reporte manual de ventas semanal",
    "description": "Cada lunes un analista copia datos de CRM, ERP y Excel.",
    "area": "Ventas",
    "category": "repetitive_work",
    "frequency": 4,
    "time_lost_minutes": 120,
    "people_affected": 3,
    "pain_level": 4
  }'
```

**Esperado**:
- Status: `201`
- `monthly_hours_lost`: **24.0** → (120 × 4 × 3) / 60
- `estimated_monthly_cost`: **600.0** → 24 × $25
- `automation_potential`: **"high"**
- `priority`: **"high"** → costo $600 > umbral $500

---

### CP-03: Crear Fricción — Espera de Terceros (Prioridad Baja)

```bash
curl -X POST http://localhost:8000/api/v1/frictions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Espera de aprobación para compras menores",
    "area": "Administración",
    "category": "waiting_dependency",
    "frequency": 2,
    "time_lost_minutes": 15,
    "people_affected": 1,
    "pain_level": 2
  }'
```

**Esperado**:
- `monthly_hours_lost`: **0.5**
- `estimated_monthly_cost`: **12.5**
- `automation_potential`: **"low"**
- `priority`: **"low"**

---

### CP-04: Crear Fricción — Duplicación de Datos (Prioridad Media)

```bash
curl -X POST http://localhost:8000/api/v1/frictions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Datos duplicados entre CRM y facturación",
    "area": "Operaciones",
    "category": "data_duplication",
    "frequency": 10,
    "time_lost_minutes": 20,
    "people_affected": 2,
    "pain_level": 3
  }'
```

**Esperado**:
- `monthly_hours_lost`: **6.67**
- `estimated_monthly_cost`: **166.67**
- `automation_potential`: **"high"**
- `priority`: **"medium"**

---

### CP-05: Crear Fricción — Alta Prioridad por Dolor Alto

```bash
curl -X POST http://localhost:8000/api/v1/frictions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sincronización manual Slack-Jira",
    "area": "Soporte",
    "category": "lack_of_integration",
    "frequency": 8,
    "time_lost_minutes": 10,
    "people_affected": 1,
    "pain_level": 5
  }'
```

**Esperado**:
- `monthly_hours_lost`: **1.33**
- `estimated_monthly_cost`: **33.33**
- `automation_potential`: **"high"**
- `priority`: **"high"** → dolor 5 ≥ 4 (a pesar de costo bajo)

---

### CP-06: Listar Fricciones

```bash
curl http://localhost:8000/api/v1/frictions
```

**Esperado**: Status `200`, array con las fricciones creadas, ordenadas por `created_at` desc.

---

### CP-07: Obtener Fricción por ID

```bash
curl http://localhost:8000/api/v1/frictions/1
```

**Esperado**: Status `200`, objeto con todos los campos incluyendo calculados.

---

### CP-08: Actualizar Fricción (Recalcula Campos)

```bash
curl -X PUT http://localhost:8000/api/v1/frictions/1 \
  -H "Content-Type: application/json" \
  -d '{"frequency": 8}'
```

**Esperado**:
- `monthly_hours_lost`: **48.0** → (120 × 8 × 3) / 60
- `estimated_monthly_cost`: **1200.0** → 48 × $25

---

### CP-09: Agregar y Listar Comentarios

```bash
# Agregar
curl -X POST http://localhost:8000/api/v1/frictions/1/comments \
  -H "Content-Type: application/json" \
  -d '{"comment": "Afecta a todo el equipo comercial."}'

# Listar
curl http://localhost:8000/api/v1/frictions/1/comments
```

**Esperado**: Crear retorna `201`, listar retorna array con el comentario.

---

### CP-10: Crear Iniciativa

```bash
curl -X POST http://localhost:8000/api/v1/initiatives \
  -H "Content-Type: application/json" \
  -d '{
    "friction_id": 1,
    "title": "Automatizar reporte con Python",
    "proposed_solution": "Script que extrae datos via API y genera reporte automáticamente.",
    "expected_reduction_percent": 90,
    "complexity": "medium",
    "priority": "high"
  }'
```

**Esperado**: Status `201`, `status`: "proposed", `friction_id`: 1.

---

### CP-11: Crear Iniciativa con Fricción Inexistente (Error)

```bash
curl -X POST http://localhost:8000/api/v1/initiatives \
  -H "Content-Type: application/json" \
  -d '{"friction_id": 999, "title": "Algo"}'
```

**Esperado**: Status `404`, `{"detail": "Referenced friction not found"}`

---

### CP-12: Actualizar Estado de Iniciativa

```bash
curl -X PUT http://localhost:8000/api/v1/initiatives/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

**Esperado**: Status `200`, `status`: "in_progress"

---

### CP-13: Dashboard — Métricas Agregadas

```bash
curl http://localhost:8000/api/v1/dashboard
```

**Esperado**:
- `total_frictions`: cantidad total
- `total_monthly_hours_lost`: suma de horas
- `total_estimated_monthly_cost`: suma de costos
- `by_category`: distribución por categoría
- `by_priority`: distribución high/medium/low
- `top_costly_frictions`: top 5 más costosas
- `initiatives_by_status`: conteo por estado

---

### CP-14: Eliminar Fricción (Cascade)

```bash
curl -X DELETE http://localhost:8000/api/v1/frictions/1
```

**Esperado**:
- Status `204`
- GET /frictions/1 → 404
- Iniciativas y comentarios vinculados eliminados

---

### CP-15: Validación de Datos (Error 422)

```bash
# Título vacío
curl -X POST http://localhost:8000/api/v1/frictions \
  -H "Content-Type: application/json" \
  -d '{"title": "", "category": "repetitive_work", "frequency": 4, "time_lost_minutes": 30, "people_affected": 1, "pain_level": 3}'

# Frecuencia negativa
curl -X POST http://localhost:8000/api/v1/frictions \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "category": "repetitive_work", "frequency": -1, "time_lost_minutes": 30, "people_affected": 1, "pain_level": 3}'

# Pain level fuera de rango (7 > max 5)
curl -X POST http://localhost:8000/api/v1/frictions \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "category": "repetitive_work", "frequency": 4, "time_lost_minutes": 30, "people_affected": 1, "pain_level": 7}'
```

**Esperado**: Todos retornan `422 Unprocessable Entity`.

---

### CP-16: Recurso Inexistente (404)

```bash
curl http://localhost:8000/api/v1/frictions/999
curl http://localhost:8000/api/v1/initiatives/999
```

**Esperado**: Status `404` con mensaje descriptivo.

---

## Casos de Prueba — Frontend (Navegador)

> **Prerrequisito**: Backend en `http://localhost:8000` y frontend en `http://localhost:4200`.

### FE-01: Carga Inicial y Navegación

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Abrir http://localhost:4200 | Redirige a /dashboard |
| 2 | Verificar sidebar | Muestra "🔥 Fricción Cero" + 3 links (Dashboard, Fricciones, Iniciativas) |
| 3 | Click "Fricciones" | Navega a /frictions, tabla se muestra |
| 4 | Click "Iniciativas" | Navega a /initiatives, tabla se muestra |
| 5 | Click "Dashboard" | Vuelve a /dashboard |

---

### FE-02: Dashboard Vacío

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Navegar a /dashboard sin datos | Cards muestran 0 fricciones, 0h, $0 |
| 2 | Verificar charts | Se renderizan vacíos sin errores |
| 3 | Verificar tabla ranking | Muestra "Sin datos aún" |

---

### FE-03: Crear Primera Fricción (Formulario Completo)

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Click "Fricciones" → "Nueva Fricción" | Formulario se muestra en /frictions/new |
| 2 | Dejar título vacío, click Guardar | Botón deshabilitado (validación) |
| 3 | Escribir título: "Carga manual de facturas" | Campo acepta texto |
| 4 | Seleccionar categoría: "Trabajo manual repetitivo" | Dropdown funciona |
| 5 | Poner frecuencia: 20 | Input numérico acepta |
| 6 | Poner minutos: 15 | Input numérico acepta |
| 7 | Poner personas: 2 | Input numérico acepta |
| 8 | Seleccionar dolor: 4 estrellas | Rating funciona (4/5) |
| 9 | Click "Guardar" | Redirige a /frictions/{id} (detalle) |
| 10 | Verificar campos calculados | Horas: 10h, Costo: $250, Automatización: high, Prioridad: high |

---

### FE-04: Detalle de Fricción — Visualización Completa

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Navegar a /frictions/{id} | Muestra título, descripción, área |
| 2 | Verificar sección "Datos de Impacto" | Frecuencia, tiempo, personas, molestia visibles |
| 3 | Verificar panel lateral | Horas mensuales en naranja, costo en rojo |
| 4 | Verificar tags | Prioridad con color (high=rojo), automatización con color |
| 5 | Verificar botones | "Editar", "Eliminar", "Crear Iniciativa" visibles |

---

### FE-05: Agregar Comentario en Detalle

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | En detalle, ver sección "Comentarios" | Vacía inicialmente |
| 2 | Escribir "Esto es urgente para el equipo" | Textarea acepta texto |
| 3 | Click botón enviar (con textarea vacía) | Botón deshabilitado |
| 4 | Click botón enviar (con texto) | Comentario aparece en la lista con fecha |
| 5 | Agregar segundo comentario | Aparece arriba del primero (orden desc) |

---

### FE-06: Editar Fricción

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | En detalle, click "Editar" | Navega a /frictions/{id}/edit |
| 2 | Verificar formulario | Campos pre-poblados con datos actuales |
| 3 | Cambiar frecuencia de 20 a 40 | Input se actualiza |
| 4 | Click "Guardar" | Redirige a detalle con horas recalculadas (20h) |

---

### FE-07: Eliminar Fricción

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | En detalle, click "Eliminar" | Confirm dialog aparece |
| 2 | Cancelar | Nada pasa, sigue en detalle |
| 3 | Confirmar eliminación | Redirige a /frictions, la fricción no aparece en tabla |

---

### FE-08: Listado de Fricciones — Tabla con Sort y Datos

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Crear 3+ fricciones con distintas prioridades | Tabla muestra todas |
| 2 | Verificar columnas | Título, Categoría, Horas/Mes, Costo/Mes, Prioridad, Acciones |
| 3 | Click header "Costo/Mes" | Tabla se ordena por costo (asc/desc toggle) |
| 4 | Click header "Prioridad" | Tabla se ordena por prioridad |
| 5 | Verificar tags de prioridad | High=rojo, Medium=amarillo, Low=verde |
| 6 | Click ojo (acciones) | Navega al detalle de esa fricción |
| 7 | Verificar paginación | Si hay >10 items, paginación aparece |

---

### FE-09: Tabla Vacía

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Sin fricciones, ir a /frictions | Mensaje "No hay fricciones registradas" |
| 2 | Verificar link | "Crear la primera" link funciona → navega a /frictions/new |

---

### FE-10: Crear Iniciativa desde Fricción

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | En detalle de fricción, click "Crear Iniciativa" | Navega a formulario/acción de creación |
| 2 | Verificar friction_id | Pre-poblado con el ID de la fricción actual |
| 3 | Llenar título: "Automatizar con script" | Campo acepta |
| 4 | Llenar solución propuesta | Textarea acepta |
| 5 | Poner reducción: 80% | Input acepta |
| 6 | Seleccionar complejidad: medium | Funciona |
| 7 | Guardar | Iniciativa creada, aparece en listado |

---

### FE-11: Listado de Iniciativas

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Navegar a /initiatives | Tabla con iniciativas creadas |
| 2 | Verificar columnas | Título, Estado, Complejidad, Prioridad, Reducción, Acciones |
| 3 | Verificar tag de estado | proposed=amarillo, in_progress=azul, completed=verde, cancelled=rojo |
| 4 | Click ojo (acciones) | Navega a /initiatives/{id} |
| 5 | Sin iniciativas | Muestra "No hay iniciativas creadas aún" |

---

### FE-12: Detalle de Iniciativa — Cambio de Estado

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Navegar a /initiatives/{id} | Muestra título, solución, detalles |
| 2 | Verificar link a fricción | "Ver fricción #X" es clickeable y navega |
| 3 | Cambiar dropdown estado a "En Progreso" | Se actualiza vía API (sin refresh) |
| 4 | Cambiar a "Completada" | Estado actualizado |
| 5 | Click "Eliminar" → Confirmar | Redirige a /initiatives, ya no aparece |

---

### FE-13: Dashboard con Datos

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Crear varias fricciones de distintas categorías | Datos disponibles |
| 2 | Navegar a /dashboard | Cards muestran totales actualizados |
| 3 | Verificar card "Total Fricciones" | Número correcto |
| 4 | Verificar card "Horas Mensuales Perdidas" | Suma correcta en naranja |
| 5 | Verificar card "Costo Mensual Estimado" | Suma correcta en rojo con $ |
| 6 | Verificar chart "Distribución por Categoría" | Bar chart horizontal con categorías |
| 7 | Verificar chart "Distribución por Prioridad" | Doughnut con 3 colores (verde/amarillo/rojo) |
| 8 | Verificar tabla ranking | Top 5 más costosas con links al detalle |
| 9 | Click en título del ranking | Navega al detalle de esa fricción |

---

### FE-14: Navegación con Sidebar — Estado Activo

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Estar en /dashboard | Link "Dashboard" resaltado en azul |
| 2 | Navegar a /frictions | Link "Fricciones" resaltado, "Dashboard" no |
| 3 | Navegar a /frictions/new | Link "Fricciones" sigue resaltado (sub-ruta) |
| 4 | Navegar a /initiatives | Link "Iniciativas" resaltado |

---

### FE-15: Responsive y Visual

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Verificar sidebar | Fondo oscuro (#1e293b), links con hover gris |
| 2 | Verificar content area | Fondo claro (#f8fafc) |
| 3 | Verificar iconos PrimeNG | pi-chart-bar, pi-list, pi-bolt visibles |
| 4 | Verificar que PrimeNG theme carga | Componentes con estilo Lara Light Blue |
| 5 | Redimensionar ventana | Layout mantiene estructura |

---

### FE-16: Manejo de Errores HTTP

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Apagar backend, intentar cargar /frictions | Tabla no explota, muestra vacía o error |
| 2 | Intentar crear fricción sin backend | Error manejado (no crash de la app) |
| 3 | Navegar a /frictions/999 (ID inexistente) | 404 del backend manejado gracefully |

---

### FE-17: Formulario — Validaciones de UI

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | Ir a /frictions/new | Botón "Guardar" deshabilitado inicialmente |
| 2 | Llenar solo título | Botón sigue deshabilitado (falta categoría) |
| 3 | Llenar título + categoría + freq + minutos | Botón se habilita |
| 4 | Rating empieza en 3 por default | 3 estrellas seleccionadas |
| 5 | Frecuencia default: 4, personas default: 1 | Valores pre-poblados |
| 6 | Click "Cancelar" | Redirige a /frictions sin guardar |

---

## Tests Automatizados (pytest)

```bash
cd backend
venv\Scripts\activate
pytest tests/ -v
```

**Resultado esperado**: 33 tests, todos PASSED.

| Archivo | Tests | Qué valida |
|---------|-------|------------|
| `test_calculation.py` | 5 | Fórmulas de horas y costo |
| `test_classification.py` | 9 | Mapeo categoría → potencial automatización |
| `test_priority.py` | 6 | Reglas de priorización |
| `test_api_frictions.py` | 8 | CRUD completo + comentarios + validación |
| `test_api_initiatives.py` | 5 | CRUD + validación FK + status |

---

## Escenarios Edge Case

| Escenario | Input | Esperado |
|-----------|-------|----------|
| Fricción mínima | freq=1, time=1, people=1, pain=1 | 0.017h, $0.42, prioridad baja |
| Fricción masiva | freq=20, time=60, people=100, pain=5 | 2000h, $50,000, prioridad alta |
| Categoría inválida | `"category": "inventada"` | 422 (Pydantic valida enum) |
| Reducción > 100% | `expected_reduction_percent: 150` | 422 (max=100) |
| Pain level 0 | `pain_level: 0` | 422 (min=1) |
| Pain level 6 | `pain_level: 6` | 422 (max=5) |
| Frecuencia 0 | `frequency: 0` | 422 (gt=0) |
| Minutos 0 | `time_lost_minutes: 0` | 422 (gt=0) |
| Título muy largo (>255 chars) | Título de 300 chars | 422 (max_length=255) |
| Crear iniciativa sin título | `{"friction_id": 1}` | 422 (title required) |
| Doble eliminación | DELETE /frictions/1 dos veces | Primera: 204, Segunda: 404 |

---

## Metodología

Proyecto construido con **Specs.md FIRE** (Fast Intent-Run Engineering):

- **1 Intent**: Fricción Cero MVP
- **11 Work Items** con dependencias explícitas
- **4 Runs** ejecutados en batch
- **33 tests** automatizados (100% pass)
- **Autonomy bias**: balanced (confirm para medium, autopilot para low)

Artefactos completos en `.specs-fire/` (state.yaml, intents, standards, runs).

---

## Construido por

**Mauricio De Juan** — mdejuan@dynamicdevs.io

Desarrollado con Kiro IDE usando Specs.md FIRE para validar el flujo de desarrollo rápido con checkpoints adaptativos.
