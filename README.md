# 🧪 SpecsMD AI-DLC: Comparativa de IDEs Agénticos

## De qué trata este experimento

Este repositorio compara cómo **3 IDEs agénticos** (Claude Code, Codex, Kiro) ejecutan la metodología
**specsmd**, en **cuatro experimentos**:

- **🧪 Experimento V1 — AI-DLC**: la misma app (un **CLI de compra de boletos de cine**) construida 3
  veces con el flujo **AI-DLC** (Init → Inception → Construction → Operations, con checkpoints humanos).
- **🔥 Experimento V2 — FIRE**: una app **fullstack** más ambiciosa (**Fricción Cero**) construida 3
  veces con el flujo **FIRE** (Intent → Work Item → Run, alta autonomía).
- **📝 Experimento V3 — Simple**: una app **CLI de IA local** (**LocalNote AI**, Python + Ollama)
  construida 3 veces con el flujo **Simple** (Requisitos → Diseño → Tareas → Implementación).
- **🧠 Experimento V4 — Ideation**: una app **CLI de IA local** (**IdeaForge Local**, Python +
  Ollama) construida 3 veces con el flujo **Ideation** (Brainstorm → Opportunities → Selected Idea →
  Requirements → Design → Tasks → Implementación). Cierra el ciclo con la fase **previa** a especificar.

El resto de este documento detalla primero el **V1**; el **V2**, **V3** y **V4**, junto con las
**conclusiones finales**, están al final.

### Experimento V1 — los 3 entornos

La misma aplicación — un CLI de compra de boletos de cine — construida 3 veces de forma independiente usando la metodología **specsmd AI-DLC** (AI-Driven Development Life Cycle) en 3 IDEs agénticos diferentes:

| Carpeta | Agente | IDE / Entorno |
|---------|--------|---------------|
| `claude-specsmd/` | Claude Code | Terminal CLI |
| `codex-specsmd/` | Codex (OpenAI) | Visual Studio Code |
| `kiro-specsmd/` | Kiro (Amazon) | Kiro IDE |

La metodología specsmd define un flujo estructurado: **Init → Inception → Construction → Operations**, donde cada fase produce artefactos documentados en una `memory-bank/`. El propósito del experimento es evaluar cómo cada agente AI interpreta y ejecuta ese mismo proceso, partiendo de la misma especificación funcional.

---

## El caso de uso

Un CLI de compra de entradas de cine que permite:

- Ver la cartelera de películas
- Consultar funciones (showtimes) por película
- Ver disponibilidad de asientos
- Comprar boletos con validación, pricing por formato (2D/3D/IMAX), descuento de martes (20%), y confirmación determinística
- Persistir compras localmente en JSON

**Restricciones intencionales**: sin APIs externas, sin base de datos, sin autenticación, sin frontend. 100% offline, determinístico y cross-platform.

---

## Comparativa de los 3 agentes

### Resumen ejecutivo

| Aspecto | Claude Code | Codex | Kiro |
|---------|-------------|-------|------|
| **Resultado** | ✅ Funcional | ✅ Funcional | ✅ Funcional |
| **Tests** | 46 tests | 121 tests | 47 tests |
| **Sesiones consumidas** | < 1 sesión | ~1.2 sesiones | 1 sesión (completa) |
| **Complicaciones** | Ninguna | Ninguna | Ninguna |
| **Entorno** | Terminal CLI | VS Code | Kiro IDE |

Los tres llegaron al mismo resultado funcional sin complicaciones para concretar. Las diferencias están en el nivel de detalle y la arquitectura que cada uno eligió.

---

### Arquitectura elegida por cada agente

#### Claude Code — Pragmático y equilibrado

```
src/
├── domain/      # Lógica pura (pricing, discount, seats, confirmation)
├── data/        # JSON fixtures + loader
├── commands/    # Handlers que retornan strings (sin console)
├── program.ts   # Commander.js + console aquí
└── index.ts     # Entry point
```

- Tests co-locados (`*.test.ts` junto al código)
- Los commands retornan strings, `program.ts` hace el `console.log`
- Precios en centavos, confirmación por hash
- Usa `tsx` para ejecutar directo sin compilar

#### Codex — Más formal y enterprise

```
src/
├── domain/          # Reglas puras
├── application/     # Casos de uso (query + purchase)
├── infrastructure/  # Lectura/escritura JSON
└── cli/             # Commander, renderers, prompts
```

- Arquitectura hexagonal (domain / application / infrastructure / cli)
- Tests en carpeta separada (`tests/`)
- Coverage explícito (95.14%)
- Variables de entorno para paths (`CINEMA_CATALOG_PATH`, `CINEMA_STATE_PATH`)
- IDs correlativos (CIN-000001, CIN-000002...)
- 121 tests — el más exhaustivo de los tres

#### Kiro — Directo y funcional

```
src/
├── domain/      # Lógica pura (types, validation, pricing, discount, confirmation)
├── commands/    # Handlers de cada comando CLI
├── data/        # Loader + persistence
└── index.ts     # Commander.js entry point
```

- Tests co-locados (`*.test.ts`)
- Estructura plana y simple
- Compila con `tsc`, ejecuta con `node dist/`
- Data en carpeta raíz `data/` separada del source
- Confirmation ID por SHA-256 truncado

---

### Nivel de detalle en la implementación

| Detalle | Claude | Codex | Kiro |
|---------|--------|-------|------|
| Capas de arquitectura | 3 | 4 (hexagonal) | 3 |
| Archivos de test | 10 | 15 | 9 |
| Tests totales | 46 | 121 | 47 |
| Coverage reportado | No | 95.14% | No |
| Error types custom | Sí | Sí | No (strings) |
| Lint/format config | No | TypeScript lint | No |
| Env vars para paths | No | Sí | No |
| Prompts interactivos | No | Sí (modo terminal) | No |
| Precios | 2D=$10, 3D=$13, IMAX=$16 | 2D=$10, 3D=$12, IMAX=$15 | 2D=$50, 3D=$70, IMAX=$120 |
| Moneda | USD centavos | USD centavos | MXN centavos |
| Confirmation ID | Hash determinístico | Correlativo secuencial | SHA-256 truncado |

---

### Experiencia de uso

| Aspecto | Claude Code | Codex | Kiro |
|---------|-------------|-------|------|
| **Interfaz** | Terminal CLI pura | VS Code integrado | IDE propio (Kiro) |
| **Consumo de sesión** | No consumió toda la sesión | Consumió 1 sesión + 20% de otra | Terminó en 1 sesión completa |
| **Interacción** | Conversacional desde terminal | Dentro del editor con preview | Dentro del IDE con chat lateral |
| **Iteraciones** | Fluidas, sin bloqueos | Requirió segunda sesión | Todo de corrido sin pausas |

---

### Observaciones del experimentador

> Con Claude no se consumió todo el nivel de sesión. Con Codex sí lo hizo y tuve que ocupar 20% de otra sesión para dejarlo listo. Con Kiro pude terminarlo al tiro.

> Con Claude lo tuve que usar desde terminal CLI y Codex pude usarlo desde Visual Studio Code. Con Kiro lo pude usar desde mi IDE Kiro.

> Todos llegaron al mismo resultado pero hicieron iteraciones distintas en el sentido de cómo lo armaron por formato, pero no hubo complicaciones para concretar.

---

## Conclusiones

1. **Los tres agentes son capaces de producir software funcional** siguiendo la misma metodología estructurada.

2. **Las diferencias son de estilo, no de resultado**. Codex fue más enterprise (4 capas, 121 tests, coverage), Claude fue equilibrado (3 capas, 46 tests), Kiro fue directo (3 capas, 47 tests).

3. **Codex fue el más costoso en tokens/sesión**, posiblemente por su nivel de exhaustividad (más tests, architecture más formal). Claude y Kiro fueron más eficientes.

4. **La metodología specsmd se adaptó bien a los tres entornos**. Los artefactos de `memory-bank/` son consistentes en estructura independientemente del agente que los generó.

5. **No hubo bloqueos ni fallos irrecuperables** en ninguno de los tres. Todas las implementaciones compilaron, pasaron tests y ejecutaron correctamente desde el primer intento de cada fase.

---

## Cómo ejecutar cada implementación

```bash
# Claude Code
cd claude-specsmd && npm install && npm run billboard

# Codex
cd codex-specsmd && npm install && npm start -- movies

# Kiro
cd kiro-specsmd && npm install && npm run build && npm run billboard
```

---

## Estructura del repositorio

```
.
├── .specsmd/                  # Metodología AI-DLC (compartida)
├── .claude/                   # Config para Claude Code
├── .codex/                    # Config para Codex
├── .kiro/                     # Config para Kiro
│
├── claude-specsmd/            # V1 · AI-DLC · CLI de cine · Claude Code
├── codex-specsmd/             # V1 · AI-DLC · CLI de cine · Codex
├── kiro-specsmd/              # V1 · AI-DLC · CLI de cine · Kiro
│
├── claude-specsmd-fire/       # V2 · FIRE · Fricción Cero · Claude Code
├── codex-specsmd-fire/        # V2 · FIRE · Fricción Cero · Codex
├── kiro-specsmd-fire/         # V2 · FIRE · Fricción Cero · Kiro
│
├── claude-specsmd-simple/     # V3 · Simple · LocalNote AI · Claude Code
├── codex-specsmd-simple/      # V3 · Simple · LocalNote AI · Codex
├── kiro-specsmd-simple/       # V3 · Simple · LocalNote AI · Kiro
│
├── claude-specsmd-ideation/   # V4 · Ideation · IdeaForge Local · Claude Code
├── codex-specsmd-ideation/    # V4 · Ideation · IdeaForge Local · Codex
├── kiro-specsmd-ideation/     # V4 · Ideation · IdeaForge Local · Kiro
│
└── README.md                  # Este archivo
```

---

## Stack común

Los tres eligieron independientemente:

- **TypeScript** (strict mode)
- **Commander.js** (CLI framework)
- **Vitest** (test runner)
- **JSON local** (datos mock + persistencia)
- **npm** (package manager)

Esto no fue impuesto — cada agente llegó a las mismas herramientas por mérito propio al evaluar el caso de uso (CLI tool en Node.js).

---

## 🔥 Experimento V2 — SpecsMD **FIRE** (app *Fricción Cero*)

> Segunda vuelta del experimento, esta vez con el flujo **FIRE** (Fast Intent-Run Engineering)
> en lugar de AI-DLC. FIRE aplana la jerarquía a **Intent → Work Item → Run** y usa checkpoints
> adaptativos (0–2) en vez de los checkpoints humanos por fase de AI-DLC. El objetivo: ver cómo
> se comporta cada agente cuando **se le da más autonomía y menos ceremonia**.

### El caso de uso (V2)

Una app **fullstack** llamada **Fricción Cero**: registrar fricciones operativas (trabajo manual,
esperas, reuniones sin decisión, falta de integración…), **calcular su impacto en tiempo y dinero**,
clasificarlas por reglas, priorizarlas automáticamente y convertirlas en **iniciativas de mejora**,
con un **dashboard**. Mucho más ambicioso que el CLI de cine del V1 (backend + frontend + DB + cálculos).

| Carpeta | Agente | IDE / Entorno |
|---------|--------|---------------|
| `claude-specsmd-fire/` | Claude Code | Terminal CLI |
| `codex-specsmd-fire/` | Codex (OpenAI) | Visual Studio Code |
| `kiro-specsmd-fire/` | Kiro (Amazon) | Kiro IDE |

### Resumen ejecutivo (V2)

| Aspecto | Claude Code | Codex | Kiro |
|---------|-------------|-------|------|
| **Resultado** | ✅ Funcional | ✅ Funcional | ✅ Funcional |
| **Backend** | FastAPI + SQLModel (Python) | Express + Prisma (Node/TS) | FastAPI + SQLAlchemy (Python) |
| **Frontend** | Angular 18 + PrimeNG 17 | Angular 21 + PrimeNG 21 | Angular 18 + PrimeNG 17 |
| **Work items** | 12 | 13 | 11 |
| **Runs FIRE** | **1** (todo de un tirón) | **13** (uno por work item) | **4** (agrupados) |
| **Sesiones consumidas** | 1 (de corrido) | **+2,5 sesiones** vs. su contraparte AI-DLC | 1 (rápido) |
| **Estilo de ejecución** | Autónomo, batch | Secuencial, ceremonioso | Planifica → ejecuta veloz |

> El número de **runs** es el dato más revelador: en FIRE, un "run" agrupa work items. Claude los
> ejecutó **todos en un solo run**, Kiro en **4**, y Codex hizo **un run por work item (13)**.

### 👀 Comparativa desde la perspectiva del experimentador

**1. Kiro — Se tomó su tiempo planificando, pero ejecutó rápido**
> Kiro se dio el tiempo de **preparar bien los intents**, pero a la hora de construir **ejecutó
> rápido y sin problemas**. Buen equilibrio entre planificación previa y velocidad de ejecución.

**2. Codex — Fiel a la metodología, pero el más costoso**
> Codex fue **uno a uno respetando la metodología** para construir (13 runs, un work item a la vez).
> Esa disciplina tuvo un costo: consumió **2,5 sesiones más** que su contraparte en AI-DLC. El más
> ceremonioso y exhaustivo, también el más caro en tiempo/sesiones.

**3. Claude Code — Todo de un tirón, pero respetando el proceso**
> Claude **ejecutó todo de corrido** (un solo run con los 12 work items), pero **respetó la
> metodología FIRE sin preguntarle al usuario** en cada paso: inicializó el workspace, capturó el
> intent, descompuso en work items y construyó, aprovechando la autonomía que FIRE habilita.

### Lectura del experimento V2

| Eje | Quién lideró | Comentario |
|-----|--------------|------------|
| **Autonomía / velocidad** | 🟢 Claude | 1 run, sin pausas, respetando el flujo |
| **Planificación previa** | 🟢 Kiro | Intents bien preparados, luego ejecución veloz |
| **Apego literal a la metodología** | 🟢 Codex | Un run por work item, máxima trazabilidad |
| **Eficiencia de sesiones** | 🟢 Claude / Kiro | Codex consumió +2,5 sesiones vs. su AI-DLC |

**Conclusión V2**: FIRE premia la autonomía. Cuanto más literal y granular fue el agente (Codex,
un run por ítem), **más caro** resultó — justo lo contrario de lo que el flujo FIRE busca. Claude
y Kiro interpretaron mejor el espíritu de FIRE (menos ceremonia, más autonomía) y llegaron al mismo
resultado funcional consumiendo mucho menos. Una observación clave frente al V1: en FIRE las
diferencias **ya no son solo de estilo, sino de costo operativo**.

> ⚠️ Nota de stack: a diferencia del V1 (donde los tres convergieron al mismo stack por mérito
> propio), en V2 hubo divergencia: **Codex eligió Node/TS + Prisma** para el backend, mientras que
> **Claude y Kiro optaron por Python/FastAPI**. Los tres coincidieron en **Angular + PrimeNG** en el
> frontend.

---

## 📝 Experimento V3 — SpecsMD **Simple** (app *LocalNote AI*)

> Tercera vuelta del experimento, esta vez con el flujo **Simple**: el más ligero de SpecsMD.
> En lugar de la ceremonia de AI-DLC o la autonomía de FIRE, Simple se concentra en lo esencial:
> **generar la especificación por fases (Requisitos → Diseño → Tareas) y luego implementar**.
> El objetivo: ver cómo cada agente produce y respeta una spec documentada en un proyecto pequeño
> y acotado.

### El caso de uso (V3)

Una app **CLI en Python** llamada **LocalNote AI**: toma una nota o texto largo y lo procesa con
**IA 100% local** vía [Ollama](https://ollama.com) (modelo por defecto `minimax-m3:cloud`,
configurable por `.env`). Cinco acciones: `summarize`, `tasks`, `clean`, `professional`, `ask`.
Restricciones intencionales: sin APIs externas, sin cloud, sin base de datos, sin frameworks web —
solo `ollama`, `python-dotenv` y `pytest`. Mucho más pequeño que el V1/V2, pensado como
laboratorio para ejercitar el flujo Simple de punta a punta.

| Carpeta | Agente | IDE / Entorno |
|---------|--------|---------------|
| `claude-specsmd-simple/` | Claude Code | Terminal CLI |
| `codex-specsmd-simple/` | Codex (OpenAI) | Visual Studio Code |
| `kiro-specsmd-simple/` | Kiro (Amazon) | Kiro IDE |

> Los tres comparten la misma estructura impuesta por la spec
> (`app.py` + `src/{config,file_loader,prompts,ai_client}.py` + `tests/` + `specs/localnote-ai/`),
> así que aquí las diferencias **no están en la arquitectura** (es idéntica), sino en **cómo se
> llegó a ella**, el manejo de errores y la cobertura de tests.

### Resumen ejecutivo (V3)

| Aspecto | Claude Code | Codex | Kiro |
|---------|-------------|-------|------|
| **Resultado** | ✅ Funcional | ✅ Funcional | ✅ Funcional |
| **Stack** | Python 3 + Ollama | Python 3 + Ollama | Python 3 + Ollama |
| **Tests (pasan)** | 14 ✅ | 8 ✅ | 14 ✅ |
| **Docs Simple** | requirements + design + tasks | requirements + design + tasks | requirements + design + tasks |
| **Sesiones** | 1 (con varias vueltas) | 1 (iteración corta) | 1 (de un tirón) |
| **Estilo de ejecución** | Iterativo, se reubicó la carpeta | Rápido y directo | Todo de una vez |

### 👀 Comparativa desde la perspectiva del experimentador

**1. Claude Code — Todo en una sesión, pero con vueltas para ubicar la carpeta**
> Claude **iteró todo en una sola sesión**, pero **se dio varias vueltas para ubicar la carpeta**
> correcta del proyecto (primero la creó en la raíz y luego hubo que moverla al lugar pedido).
> Llegó al resultado completo, con la mayor cobertura de tests y el manejo de errores más
> desacoplado (excepción propia capturada en `app.py`, sin `sys.exit` ni `print` en la capa de IA).

**2. Kiro — Lo mismo, pero ejecutado de una sola vez**
> Kiro hizo **lo mismo** (una sesión, resultado completo) pero **se ejecutó todo de una sola vez**,
> sin reubicaciones ni vueltas. Misma cobertura de tests que Claude (14). Manejó los errores de
> Ollama dentro del propio cliente (`sys.exit` + mensajes), un enfoque más directo aunque más
> acoplado a la I/O.

**3. Codex — Una sola sesión, iteración corta y todo rápido**
> Codex **solo ocupó una sesión, la iteración fue corta y todo salió rápido**. Su implementación
> fue la más minimalista (8 tests, error como `RuntimeError` que propaga limpio). El más económico
> y veloz de los tres en esta ronda.

### Lectura del experimento V3

| Eje | Quién destacó | Comentario |
|-----|---------------|------------|
| **Velocidad / economía** | 🟢 Codex | Iteración corta, una sesión, todo rápido |
| **Ejecución sin fricción** | 🟢 Kiro | Todo de una vez, sin reubicar carpetas |
| **Cobertura de tests** | 🟢 Claude / Kiro | 14 tests cada uno vs. 8 de Codex |
| **Desacople de errores** | 🟢 Claude | Excepción propia capturada en `app.py`, capa de IA pura |

**Conclusión V3**: en un proyecto pequeño y con la estructura ya fijada por la spec, los tres
convergen a **la misma arquitectura** y a un resultado funcional en **una sola sesión** — el flujo
Simple iguala mucho el terreno. Las diferencias se vuelven sutiles: Codex prioriza ir rápido y
ligero, Kiro ejecuta sin fricción de un tirón, y Claude invierte en más tests y mejor separación de
responsabilidades a cambio de alguna vuelta extra (en este caso, ubicar la carpeta). A menor
ceremonia y menor tamaño, **menor distancia entre los agentes**: lo contrario al V2, donde FIRE
amplificó las diferencias de costo.

---

## 🧠 Experimento V4 — SpecsMD **Ideation** (app *IdeaForge Local*)

> Cuarta y última vuelta del experimento, centrada en la fase de **Ideation** de SpecsMD: el paso
> **previo** a especificar. En lugar de partir de un alcance ya dado, cada agente recorre primero un
> flujo de ideación documentado (**Brainstorm → Opportunities → Selected Idea → Requirements →
> Design → Tasks**) y **solo después** implementa. El objetivo: evaluar no la construcción guiada,
> sino la **generación temprana de ideas y alcance** antes de bajar a código.

### El caso de uso (V4)

Una app **CLI en Python** llamada **IdeaForge Local**: recibe una idea desordenada y, con **IA 100%
local** vía [Ollama](https://ollama.com) (modelo por defecto `minimax-m3:cloud`, configurable por
`.env`), la convierte en una propuesta clara. Cuatro modos: `ideate` (idea cruda → propuesta
estructurada), `compare` (varias ideas → recomendación), `mvp` (idea grande → MVP mínimo) y `brief`
(idea → brief técnico). Restricciones intencionales: sin APIs externas, sin cloud, sin base de
datos, sin frameworks web — solo `ollama`, `python-dotenv` y `pytest`. Lo distintivo del V4 es que
**antes del código** cada agente produjo los 6 documentos de ideación en `specs/ideaforge-local/`.

| Carpeta | Agente | IDE / Entorno |
|---------|--------|---------------|
| `claude-specsmd-ideation/` | Claude Code | Terminal CLI |
| `codex-specsmd-ideation/` | Codex (OpenAI) | Visual Studio Code |
| `kiro-specsmd-ideation/` | Kiro (Amazon) | Kiro IDE |

> Los tres recorrieron primero el flujo de Ideation (los 6 docs `00_brainstorm` → `05_tasks`) y
> luego implementaron la misma app. La estructura de código quedó prácticamente idéntica
> (`app.py` + `src/{config,ai_client,prompts,file_loader,output_writer}.py` + `tests/`), así que
> las diferencias están en **cómo organizaron la carpeta**, la **cobertura de tests** y el nivel de
> detalle de los documentos de ideación.

### Resumen ejecutivo (V4)

| Aspecto | Claude Code | Codex | Kiro |
|---------|-------------|-------|------|
| **Resultado** | ✅ Funcional | ✅ Funcional | ✅ Funcional |
| **Stack** | Python 3 + Ollama | Python 3 + Ollama | Python 3 + Ollama |
| **Tests (pasan)** | 21 ✅ | 15 ✅ | 21 ✅ |
| **Test del CLI (`app.py`)** | No (módulos puros) | **Sí (`test_app.py`)** | No (módulos puros) |
| **Docs Ideation** | 6 (`00`→`05`) | 6 (`00`→`05`) | 6 (`00`→`05`) |
| **Layout del proyecto** | Anidado en `ideaforge-local/` | **Plano en la raíz** de la carpeta | Anidado en `ideaforge-local/` |
| **Sesiones** | 1 (con vueltas para ubicar carpeta) | 1 (directo) | 1 (de un tirón) |
| **Estilo de ejecución** | Documenta a fondo, itera el layout | Rápido y pragmático | Todo de una vez, ordenado |

### 👀 Comparativa desde la perspectiva del experimentador

**1. Claude Code — Ideación a fondo, con alguna vuelta de layout**
> Claude **ejecutó directo todo el flujo de Ideation** y luego implementó, con la mayor cobertura de
> tests (21) y documentos de ideación detallados. Como en el V3, se dio **alguna vuelta para ubicar
> la carpeta** (creó el proyecto y luego lo acomodó en el lugar pedido). Probó la app end-to-end
> contra Ollama real.

**2. Codex — Directo, pragmático y el único que testeó el CLI**
> Codex fue **rápido y al grano**: dejó el proyecto **plano en la raíz** de su carpeta (sin anidar) y
> fue el **único que escribió un test del CLI** (`test_app.py`), aunque con menos tests en total (15).
> Sin vueltas, una sola sesión.

**3. Kiro — Todo de una vez y ordenado**
> Kiro **ejecutó todo de corrido** sin pausas ni reubicaciones, con la misma cobertura que Claude
> (21 tests) y la misma estructura anidada. El más fluido de los tres en esta ronda.

### Lectura del experimento V4

| Eje | Quién destacó | Comentario |
|-----|---------------|------------|
| **Ejecución directa** | 🟢 Los tres | Nadie se trabó: del brainstorm al código sin bloqueos |
| **Cobertura de tests** | 🟢 Claude / Kiro | 21 tests cada uno vs. 15 de Codex |
| **Test de extremo a extremo del CLI** | 🟢 Codex | El único con `test_app.py` |
| **Ejecución sin fricción** | 🟢 Kiro | De un tirón, sin reubicar carpetas |
| **Profundidad de ideación** | 🟢 Claude | Documentos `00`→`05` más detallados |

**Conclusión V4**: cuando el trabajo arranca en **Ideation** (pensar antes de codear), los tres
agentes **ejecutaron el flujo completo de corrido y sin complicaciones**, y **ninguno consumió más
de una sesión**. Al igual que en el V3, una metodología ligera y bien acotada **iguala mucho el
terreno**: los tres convergen a la misma arquitectura y a un resultado funcional. Las diferencias
quedan en matices — Claude documenta y testea más (a cambio de alguna vuelta de layout), Kiro
ejecuta sin fricción, y Codex es el más pragmático y el único que probó el CLI de punta a punta.

---

## 🏁 Conclusiones finales del experimento (V1 → V4)

Tras cuatro rondas y cuatro flujos (**AI-DLC, FIRE, Simple, Ideation**) con tres agentes:

1. **Todos ejecutaron estas metodologías directo y sin problemas.** En las cuatro rondas, los tres
   agentes (Claude, Codex, Kiro) llegaron a un resultado **funcional, compilando y con tests en
   verde**, sin bloqueos ni fallos irrecuperables. La metodología SpecsMD se adapta a los tres
   entornos.

2. **Nadie consumió más de una sesión** en las rondas de proyecto acotado (V3 Simple y V4 Ideation):
   los tres agentes resolvieron el alcance completo dentro de **una única sesión**. El costo solo se
   disparó en el extremo opuesto — V2 (FIRE) con apego literal y granular (Codex, +2,5 sesiones).

3. **A menor ceremonia y menor tamaño, menor distancia entre agentes.** FIRE (V2) amplificó las
   diferencias de costo; Simple (V3) e Ideation (V4) las redujeron a matices de cobertura de tests y
   organización. La elección de flujo importa tanto como la del agente.

### ¿Cuál fue la mejor metodología?

**Ideation (V4) y Simple (V3) fueron las más eficientes y predecibles**, y de las dos, **Ideation se
lleva el primer lugar**: añade el paso de *pensar antes de construir* (brainstorm → oportunidades →
idea elegida → requisitos → diseño → tareas) **sin costar más** —los tres agentes la ejecutaron de
corrido en una sola sesión— y produce un proyecto mejor fundamentado, con su alcance justificado por
escrito antes de la primera línea de código. Para proyectos pequeños y acotados es el mejor
equilibrio entre rigor y costo. **AI-DLC (V1)** sigue siendo la opción para proyectos grandes que
exigen checkpoints humanos por fase, y **FIRE (V2)** premia la autonomía pero penaliza el apego
literal.

### ¿Con qué modelo lo ocuparía?

Para **construir** (las cuatro metodologías, agentes que escriben y razonan sobre el código):
**Claude Code con un modelo Claude Opus** (la familia 4.x) — fue el más consistente en cobertura de
tests, separación de responsabilidades y profundidad de documentación a lo largo de las cuatro
rondas, sin disparar el costo en los proyectos acotados.

Para la **IA local dentro de las apps** (V3 y V4, donde la app usa Ollama): **`minimax-m3:cloud`**
vía Ollama, tal como quedó por defecto en las tres implementaciones — local, sin APIs externas,
configurable por `.env` y suficiente para las tareas de ideación, resumen y generación de los CLIs.

> **En una frase:** *Ideation + Claude Code (Opus) para guiar la construcción, y `minimax-m3:cloud`
> vía Ollama para la IA local de la app.* Es la combinación que dio el mejor resultado al menor costo
> en proyectos pequeños y bien acotados.

---

## Construido por

**Mauricio De Juan** — mdejuan@dynamicdevs.io

Experimento diseñado para validar la metodología **SpecsMD AI-DLC** como framework de especificación y desarrollo guiado por agentes AI. La hipótesis central es que una metodología estructurada (Init → Inception → Construction → Operations) permite obtener resultados consistentes y comparables independientemente del IDE agéntico utilizado.

---

## Flujos cubiertos

Los **cuatro flujos** de SpecsMD quedan cubiertos por las cuatro rondas del experimento:

- ~~**AI-DLC** — Flujo completo con checkpoints humanos por fase.~~ ✅ Cubierto en el **Experimento V1** (CLI de cine).
- ~~**Fire** — Ejecución rápida con 0-2 checkpoints.~~ ✅ Cubierto en el **Experimento V2** (*Fricción Cero*).
- ~~**Simple** — Solo generación de spec por fases (Requisitos → Diseño → Tareas) + implementación.~~ ✅ Cubierto en el **Experimento V3** (*LocalNote AI*).
- ~~**Ideation** — Pensar antes de construir (Brainstorm → Opportunities → Selected Idea → Requirements → Design → Tasks).~~ ✅ Cubierto en el **Experimento V4** (*IdeaForge Local*).

Con las cuatro rondas se puede contrastar **ceremonia alta vs. autonomía alta vs. mínima vs.
ideación temprana**: el V2 mostró que en FIRE el apego literal y granular (Codex) se vuelve más
costoso; el V3 y el V4 mostraron que en proyectos pequeños los flujos Simple e Ideation **igualan
mucho a los tres agentes**, reduciendo las diferencias a matices de cobertura de tests y
organización. Ver las **🏁 Conclusiones finales** más arriba.
