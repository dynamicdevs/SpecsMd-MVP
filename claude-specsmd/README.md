# 🎬 Cinema CLI — Laboratorio specsmd AI-DLC (Claude Code)

CLI de **compra de entradas de cine** sobre datos mock. Permite ver la cartelera,
listar funciones, consultar asientos, calcular precios por formato (2D / 3D / IMAX),
aplicar el **descuento de los martes** y generar una **confirmación de compra**.

---

## 🎯 Objetivo

Este proyecto es un **caso de laboratorio** para probar la metodología **specsmd
AI-DLC** (AI-Driven Development Life Cycle) de forma idéntica en tres IDEs agénticos:
**Claude Code, Codex y Kiro**. La idea es usar un caso pequeño pero realista para
comparar de forma justa cómo cada herramienta recorre el flujo completo:

> **Init → Inception (planificación) → Construction (build) → Operations**

Esta carpeta (`claude-specsmd`) contiene el **código resultante de la ejecución con
Claude Code**: una aplicación autocontenida, sin framework, lista para ejecutarse en
local con `npm`.

Lo que se ejercita a propósito:

- **Lógica de dominio pura y testeable** (precios, validación de asientos, descuento, confirmación).
- **Separación de capas estricta** (dominio sin I/O vs. capa de comandos con consola).
- **Comportamiento determinista** (datos mock + IDs de confirmación reproducibles).

---

## ✨ Funcionalidades

| Comando | Qué hace |
|---------|----------|
| `billboard` | Muestra la cartelera (películas disponibles con su ID y formatos) |
| `showtimes --movie <id>` | Lista las funciones de una película (ID, fecha/hora, formato, sala) |
| `seats --showtime <id>` | Muestra el mapa de asientos (disponibles `O` / vendidos `X`) |
| `buy ...` | Compra uno o más asientos y genera la confirmación |

Reglas de negocio:

- **Precios por formato**: 2D = `$10.00`, 3D = `$13.00` (`+$3`), IMAX = `$16.00` (`+$6`).
- **Descuento de martes**: **20%** sobre el subtotal cuando la función cae en martes
  (se calcula a partir de la fecha de la función, no del reloj real → determinista).
- **Validación todo-o-nada**: si algún asiento no existe o ya está vendido, **no se
  reserva nada** y se informa el/los asiento(s) problemáticos.
- **Confirmación determinista**: ID generado por hash de la orden (no aleatorio), así
  los tests son reproducibles.

---

## 🧱 Arquitectura

Principio clave: **el dominio es puro y libre de framework**. Commander.js y `console`
viven **solo** en la capa de comandos / punto de entrada.

```
src/
├── domain/                  # Lógica PURA (sin Commander, sin console, sin fs)
│   ├── types.ts             # Movie, Showtime, Seat, Format, Order, Confirmation
│   ├── errors.ts            # Errores de dominio tipados
│   ├── pricing.ts           # priceSeats() — precio por formato
│   ├── discount.ts          # applyTuesdayDiscount() — 20% los martes
│   ├── seats.ts             # validateSeatSelection() — todo-o-nada
│   ├── confirmation.ts      # generateConfirmation() — ID determinista
│   └── index.ts             # API pública del dominio
├── data/                    # Carga de datos mock (única capa que toca el disco)
│   ├── movies.json          # Catálogo de películas
│   ├── showtimes.json       # Funciones + mapas de asientos
│   └── loader.ts            # loadDataset() + validación
├── commands/                # Capa de comandos (devuelve strings, sin console aquí)
│   ├── billboard.ts         # formatBillboard()
│   ├── showtimes.ts         # formatShowtimes()
│   ├── seats.ts             # formatSeats()
│   ├── buy.ts               # runBuy() — orquesta el dominio
│   ├── confirmation-view.ts # formatConfirmation() — recibo
│   ├── format.ts            # formatMoney() — centavos → $X.XX
│   └── errors.ts            # Errores de la capa CLI (película/función desconocida)
├── program.ts               # Commander: aquí viven console.log / console.error
└── index.ts                 # Punto de entrada del CLI
```

> Los archivos `*.test.ts` están junto al código que prueban (Vitest).

---

## ✅ Requisitos previos

- **Node.js ≥ 18** (probado en Node 24)
- **npm** (incluido con Node)

No requiere base de datos, red, ni servicios externos.

---

## 🚀 Puesta en marcha (desarrollo)

### 1. Instalar dependencias

```bash
cd claude-specsmd
npm install
```

### 2. Ejecutar la aplicación

Los comandos se ejecutan vía npm scripts (usan `tsx` para correr TypeScript
directamente, sin compilar). **Importante:** al pasar argumentos con npm hay que
anteponer `--` para que lleguen al programa.

#### Ver la cartelera

```bash
npm run billboard
```

Salida esperada:

```
Now Showing:
  [m1] Dune: Part Two (2D, 3D, IMAX)
  [m2] Inside Out 2 (2D, 3D)
  [m3] The Matrix Resurrections (2D, IMAX)
```

#### Listar funciones de una película

```bash
npm run showtimes -- --movie=m1
```

Salida esperada:

```
Showtimes for Dune: Part Two:
  [st1] 2026-06-23T19:00:00Z · IMAX · IMAX Hall · 6 seat(s) available
  [st2] 2026-06-24T21:30:00Z · 3D · Hall 2 · 7 seat(s) available
```

#### Ver los asientos de una función

```bash
npm run seats -- --showtime=st1
```

Salida esperada (los vendidos aparecen como `X`):

```
Seats for showtime st1 (IMAX, IMAX Hall):
  Legend: O = available, X = sold
  A1 [O]
  A2 [X]
  A3 [O]
  A4 [O]
  B1 [O]
  B2 [O]
  B3 [X]
  B4 [O]

Available: A1, A3, A4, B1, B2, B4
```

#### Comprar entradas

```bash
npm run buy -- --movie=m1 --showtime=st1 --seats=A1,A3 --name=Ana
```

Salida esperada (función IMAX en **martes** → 20% de descuento):

```
=== Purchase Confirmed ===
Confirmation ID : CINE-D9972D16
Movie           : Dune: Part Two
Showtime        : 2026-06-23T19:00:00Z · IMAX · IMAX Hall
Seats           : A1, A3
Customer        : Ana
Subtotal        : $32.00
Discount        : $6.40
Total           : $25.60
```

> Cálculo: 2 asientos IMAX × $16.00 = **$32.00**; martes −20% (**$6.40**) = **$25.60**.

#### Ayuda integrada

```bash
npm start -- --help
npm run buy -- --help
```

---

## 🎛️ Datos mock disponibles

Para que puedas experimentar, estos son los IDs que existen en los datos mock:

### Películas (`src/data/movies.json`)

| ID | Título | Formatos |
|----|--------|----------|
| `m1` | Dune: Part Two | 2D, 3D, IMAX |
| `m2` | Inside Out 2 | 2D, 3D |
| `m3` | The Matrix Resurrections | 2D, IMAX |

### Funciones (`src/data/showtimes.json`)

| ID | Película | Fecha | Día | Formato | Sala | Asientos vendidos |
|----|----------|-------|-----|---------|------|-------------------|
| `st1` | m1 | 2026-06-23 | **Martes** | IMAX | IMAX Hall | A2, B3 |
| `st2` | m1 | 2026-06-24 | Miércoles | 3D | Hall 2 | A1 |
| `st3` | m2 | 2026-06-23 | **Martes** | 2D | Hall 3 | B4 |
| `st4` | m3 | 2026-06-25 | Jueves | IMAX | IMAX Hall | A3, A4 |

Cada función tiene 8 asientos: filas A y B, números 1–4 (`A1`…`B4`).

> Usa `st1` o `st3` para ver el **descuento de martes**; `st2` o `st4` para ver una
> compra **sin descuento**.

---

## 🧪 Probando casos de error

La compra es **todo-o-nada** y muestra mensajes claros con código de salida ≠ 0:

```bash
# Asiento ya vendido (A2 en st1)
npm run buy -- --movie=m1 --showtime=st1 --seats=A1,A2 --name=Ana
# → Error: Seat(s) already sold: A2.

# Asiento inexistente
npm run buy -- --movie=m1 --showtime=st1 --seats=Z9 --name=Ana
# → Error: Unknown seat code(s): Z9.

# Película desconocida
npm run showtimes -- --movie=zzz
# → Error: Unknown movie id: zzz

# Función desconocida
npm run seats -- --showtime=stX
# → Error: Unknown showtime id: stX
```

---

## ✔️ Tests y verificación de tipos

```bash
npm test         # Ejecuta la suite completa de Vitest (46 pruebas)
npm run test:watch   # Modo watch
npm run typecheck    # tsc --noEmit (TypeScript estricto)
```

Cobertura de la suite:

- **Dominio**: precios 2D/3D/IMAX, descuento de martes (incl. redondeo), validación de
  asientos (desconocido/vendido/duplicado/vacío), confirmación determinista.
- **Capa CLI**: carga/validación de datos, render de cartelera/funciones/asientos,
  flujo de compra (con y sin descuento) y manejo de errores + código de salida.

---

## 🚫 Fuera de alcance (por diseño)

Este es un laboratorio local pequeño. **No** incluye: pago real, autenticación, base
de datos real, APIs externas, frontend web ni despliegue. Los datos viven en archivos
JSON dentro del repositorio.

---

## 📦 Stack

TypeScript (modo estricto) · Node.js · Commander.js (CLI) · Vitest (tests) ·
datos mock en JSON · npm. Sin framework de aplicación.
