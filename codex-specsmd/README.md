# Cinema Ticket CLI — implementación Codex

Una aplicación de consola para explorar una cartelera, consultar funciones y asientos, y simular la compra de entradas de cine. Funciona completamente offline con datos JSON locales y fue construida como caso de laboratorio para evaluar la metodología **SpecsMD AI-DLC**.

La gracia del proyecto no es solo comprar una entrada ficticia: es demostrar que una especificación pequeña pero realista puede transformarse en una aplicación determinística, testeada y comparable entre distintos agentes de desarrollo.

## Qué permite hacer

- Listar películas disponibles.
- Consultar funciones por película.
- Ver asientos disponibles y vendidos.
- Comprar uno o varios asientos.
- Calcular precios para formatos 2D, 3D e IMAX.
- Aplicar automáticamente un 20% de descuento los martes.
- Rechazar asientos inexistentes, duplicados o vendidos.
- Generar una confirmación con ID correlativo.
- Persistir compras y asientos vendidos entre ejecuciones.

## Inicio rápido

Necesitas una versión LTS vigente de Node.js y npm.

```bash
cd codex-specsmd
npm install
npm start -- --help
```

La aplicación no consume APIs, no requiere base de datos y no necesita conexión a internet para ejecutarse.

## Caso de uso: comprar entradas para Dune

Este recorrido cubre el flujo principal de punta a punta.

### 1. Revisar la cartelera

```bash
npm start -- movies
```

```text
movie-dune-2 | Dune: Part Two | PG-13
movie-inside-out-2 | Inside Out 2 | PG
movie-matrix | The Matrix | R
```

### 2. Consultar las funciones de Dune

```bash
npm start -- showtimes movie-dune-2
```

```text
showtime-dune-imax-tuesday | 2026-06-23T19:00:00Z | IMAX | IMAX Hall
showtime-dune-3d-wednesday | 2026-06-24T21:30:00Z | 3D | Hall 1
```

### 3. Ver los asientos de la función IMAX

```bash
npm start -- seats showtime-dune-imax-tuesday
```

```text
A1 | available
A2 | sold
A3 | available
A4 | available
B1 | available
B2 | available
B3 | sold
B4 | available
```

### 4. Comprar dos entradas

```bash
npm start -- buy --name "Ada Lovelace" --showtime showtime-dune-imax-tuesday --seats A1,A3
```

La función ocurre un martes, por lo que la compra recibe el descuento determinístico del 20%:

```text
Confirmation: CIN-000001
Customer: Ada Lovelace
Movie: Dune: Part Two (movie-dune-2)
Showtime: showtime-dune-imax-tuesday
Starts at: 2026-06-23T19:00:00Z
Format: IMAX
Auditorium: IMAX Hall (auditorium-imax)
Seats: A1, A3
Unit price: USD 15.00
Subtotal: USD 30.00
Discount: USD 6.00
Total: USD 24.00
```

La compra queda almacenada en `data/state.json`. Si otra ejecución intenta comprar `A1` para la misma función, la CLI la rechazará sin modificar el estado previo.

> El ID mostrado supone el estado inicial incluido en el repositorio. Después de otras compras, la secuencia continúa con `CIN-000002`, `CIN-000003`, etc.

## Comandos

```text
movies
  Lista la cartelera completa.

showtimes <movie-id>
  Lista las funciones asociadas a una película.

seats <showtime-id>
  Muestra el estado de cada asiento de una función.

buy --name <customer> --showtime <id> --seats <ids>
  Valida, calcula, confirma y persiste una compra.
```

En una terminal interactiva, `buy` puede solicitar los valores omitidos. En scripts o entradas redirigidas, las tres opciones son obligatorias y la ejecución falla inmediatamente si falta alguna.

## Diseño

```text
src/
├── domain/          Reglas puras de asientos, precios y descuentos
├── application/     Casos de uso de consulta y compra
├── infrastructure/  Lectura y persistencia segura de JSON
└── cli/             Commander.js, renderizado, prompts y códigos de salida
```

La capa CLI no contiene reglas de negocio. Las decisiones de precios, descuentos y validación viven en el dominio, mientras que la escritura del estado se realiza únicamente después de validar la compra completa.

Los artefactos de requisitos, historias, bolts y walkthroughs generados durante AI-DLC están disponibles en [`memory-bank/`](./memory-bank/).

## Datos y determinismo

- `data/catalog.json` contiene películas, auditorios y funciones mock.
- `data/state.json` conserva compras, asientos vendidos y la secuencia de confirmaciones.
- El dinero se representa en centavos enteros para evitar errores de punto flotante.
- El descuento de martes se calcula usando la fecha UTC de la función.
- Las salidas no dependen del locale ni incluyen rutas del sistema operativo.
- Los errores esperados usan `stderr` y códigos de salida estables.

Los harnesses automatizados pueden aislar archivos mediante `CINEMA_CATALOG_PATH` y `CINEMA_STATE_PATH`.

## Calidad

```bash
npm run build          # Compila TypeScript estricto
npm run lint           # Valida fuente y pruebas mediante TypeScript
npm test               # Ejecuta Vitest una vez
npm run test:coverage  # Ejecuta la suite con cobertura V8
```

Estado actual de la implementación:

- 121 pruebas pasando.
- 95.14% de cobertura de líneas.
- Pruebas unitarias, de integración y entre procesos.
- Fixtures temporales y reseteables; los tests no modifican el estado incluido en el repositorio.

## Stack

- TypeScript
- Node.js
- Commander.js
- Vitest
- JSON local
- npm

## Alcance intencional

Este laboratorio no incluye pagos reales, autenticación, APIs externas, base de datos, frontend web ni despliegue. El alcance reducido es deliberado: mantiene el caso fácil de ejecutar y suficientemente rico para comparar cómo distintos agentes convierten las mismas especificaciones en software funcional.
