# 🧪 SpecsMD AI-DLC: Comparativa de IDEs Agénticos

## De qué trata este experimento

Este repositorio contiene **la misma aplicación** — un CLI de compra de boletos de cine — construida 3 veces de forma independiente usando la metodología **specsmd AI-DLC** (AI-Driven Development Life Cycle) en 3 IDEs agénticos diferentes:

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
├── .specsmd/              # Metodología AI-DLC (compartida)
├── .claude/               # Config para Claude Code
├── .codex/                # Config para Codex
├── .kiro/                 # Config para Kiro
├── claude-specsmd/        # Implementación Claude Code
├── codex-specsmd/         # Implementación Codex
├── kiro-specsmd/          # Implementación Kiro
└── README.md              # Este archivo
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

## Construido por

**Mauricio De Juan** — mdejuan@dynamicdevs.io

Experimento diseñado para validar la metodología **SpecsMD AI-DLC** como framework de especificación y desarrollo guiado por agentes AI. La hipótesis central es que una metodología estructurada (Init → Inception → Construction → Operations) permite obtener resultados consistentes y comparables independientemente del IDE agéntico utilizado.

---

## Próximos pasos

Este experimento usó el flujo **AI-DLC** (el más completo de SpecsMD, con checkpoints humanos en cada fase). A futuro se probará el mismo caso con los otros flujos disponibles en la metodología:

- **Simple** — Solo generación de spec, sin ejecución guiada. Ideal para proyectos donde el desarrollador quiere la planificación pero implementa manualmente.
- **Fire** — Ejecución rápida con 0-2 checkpoints. Menos fricción, más autonomía del agente, menos control humano.

La comparativa permitirá entender qué nivel de ceremonia y supervisión humana es óptimo según el tipo de proyecto y la complejidad del dominio.
