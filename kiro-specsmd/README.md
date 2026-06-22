# 🎬 Cinema Ticket CLI

CLI tool para compra de boletos de cine. Permite ver la cartelera, consultar funciones, revisar disponibilidad de asientos y realizar compras con confirmación.

Implementado con la metodología **specsmd AI-DLC** usando **Kiro**.

---

## Requisitos

- Node.js >= 18
- npm

## Instalación

```bash
cd kiro-specsmd
npm install
npm run build
```

## Uso

Todos los comandos se ejecutan desde la raíz del proyecto.

### Ver la cartelera

```bash
npm run billboard
```

Salida:

```
🎬 Billboard

  [movie-001] El Secreto de sus Ojos (2D)
  [movie-002] Dune: Parte Dos (3D, IMAX)
  [movie-003] Spider-Man: Across the Spider-Verse (2D, 3D, IMAX)
```

### Consultar funciones de una película

```bash
npm run showtimes -- --movie movie-002
```

Salida:

```
🕐 Showtimes for "Dune: Parte Dos"

  [st-002] 2026-06-23 20:30 - 3D (Sala 2)
  [st-003] 2026-06-23 17:00 - IMAX (Sala IMAX)
```

### Ver disponibilidad de asientos

```bash
npm run seats -- --showtime st-001
```

Salida:

```
💺 Seats for 2026-06-22 18:00 (2D)

  Available: 20 | Sold: 0

  🟢 A1 [A1]
  🟢 A2 [A2]
  ...
  🟢 D5 [D5]
```

### Comprar boletos

```bash
npm run buy -- --showtime st-002 --seats A1,A2 --customer "Juan Pérez"
```

Salida:

```
🎫 Purchase Confirmation

  ID:        c7653639
  Customer:  Juan Pérez
  Movie:     Dune: Parte Dos
  Showtime:  2026-06-23 20:30 (3D)
  Seats:     A1, A2
  Subtotal:  $140.00
  Discount:  -$28.00 (20% Tuesday)
  Total:     $112.00
```

> Los asientos comprados se marcan como vendidos. Si ejecutas `seats` de nuevo, aparecerán en rojo (🔴).

### Ejemplo de compra rechazada (asiento ocupado)

```bash
npm run buy -- --showtime st-002 --seats A1 --customer "María"
```

Salida (si A1 ya fue comprado):

```
Error: Seat "A1" is already sold
```

Exit code: 1

---

## Comandos directos (sin npm scripts)

También puedes ejecutar directamente el binario compilado:

```bash
node dist/index.js billboard
node dist/index.js showtimes --movie movie-003
node dist/index.js seats --showtime st-005
node dist/index.js buy --showtime st-001 --seats B1,B2,B3 --customer "Carlos López"
```

---

## Tests

```bash
npm test
```

Ejecuta Vitest con 47 tests unitarios e integración:

```
✓ src/domain/validation.test.ts (6 tests)
✓ src/domain/pricing.test.ts (8 tests)
✓ src/domain/discount.test.ts (6 tests)
✓ src/domain/confirmation.test.ts (5 tests)
✓ src/data/loader.test.ts (5 tests)
✓ src/commands/billboard.test.ts (2 tests)
✓ src/commands/showtimes.test.ts (3 tests)
✓ src/commands/seats.test.ts (3 tests)
✓ src/commands/buy.test.ts (9 tests)

Test Files  9 passed (9)
     Tests  47 passed (47)
```

---

## Estructura del proyecto

```
kiro-specsmd/
├── data/                    # JSON fixtures (runtime data)
│   ├── movies.json
│   ├── showtimes.json
│   ├── seats.json
│   └── purchases.json       # Creado automáticamente tras primera compra
├── src/
│   ├── domain/              # Lógica de negocio pura (sin I/O)
│   │   ├── types.ts
│   │   ├── validation.ts
│   │   ├── pricing.ts
│   │   ├── discount.ts
│   │   ├── confirmation.ts
│   │   └── index.ts
│   ├── commands/            # Handlers de comandos CLI
│   │   ├── billboard.ts
│   │   ├── showtimes.ts
│   │   ├── seats.ts
│   │   └── buy.ts
│   ├── data/
│   │   ├── loader.ts        # Carga JSON a tipos del dominio
│   │   └── persistence.ts   # Persiste compras a JSON
│   └── index.ts             # Entry point (Commander.js)
├── dist/                    # Output compilado (generado por tsc)
├── memory-bank/             # Artefactos specsmd AI-DLC
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Reglas de negocio

| Regla | Detalle |
|-------|---------|
| Precios | 2D: $50, 3D: $70, IMAX: $120 por asiento |
| Descuento | 20% si la función es un martes |
| Validación | All-or-nothing: si un asiento falla, se rechaza toda la compra |
| Confirmación | ID determinístico (SHA-256 truncado a 8 chars) |
| Persistencia | Las compras se guardan en `data/purchases.json` |

---

## Resetear datos

Para volver al estado inicial (sin compras), elimina el archivo de persistencia:

```bash
rm data/purchases.json
```

---

## Tecnologías

- TypeScript (strict mode)
- Commander.js (CLI framework)
- Vitest (test runner)
- Node.js built-ins (fs, path, crypto)

---

## Metodología

Este proyecto fue construido usando **specsmd AI-DLC** en Kiro, siguiendo las fases:

1. **Inception** — Requisitos, contexto, units, stories, bolt plan
2. **Construction** — 3 bolts ejecutados secuencialmente (domain → read CLI → buy CLI)
3. **Artefactos** — Documentados en `memory-bank/`
