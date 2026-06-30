# LocalNote AI

LocalNote AI es una aplicacion local de consola hecha en Python para procesar notas con IA usando Ollama. Permite resumir texto, extraer tareas pendientes, ordenar notas desordenadas, convertir ideas informales en respuestas profesionales y hacer preguntas sobre un texto dado.

El proyecto esta construido como un laboratorio pequeno para practicar Specs.md en flujo SIMPLE: primero requisitos, luego diseno, luego tareas, y finalmente implementacion.

## Requisitos

- Python 3.11 o superior.
- Ollama instalado y ejecutandose localmente.
- Modelo de Ollama disponible: `minimax-m3:cloud`.

No usa OpenAI, Anthropic, Gemini, APIs externas, servicios cloud, bases de datos, scraping, Docker ni frameworks web.

## Instalacion

Desde esta carpeta:

```bash
cd codex-specsmd-simple/localnote-ai
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

En Linux/macOS:

```bash
cd codex-specsmd-simple/localnote-ai
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Configuracion

Crea un archivo `.env` si quieres cambiar el modelo:

```env
OLLAMA_MODEL=minimax-m3:cloud
```

Si `OLLAMA_MODEL` no existe o esta vacio, la aplicacion usa por defecto:

```text
minimax-m3:cloud
```

## Como ejecutar Ollama

Instala Ollama desde su sitio oficial y deja el servicio activo. Luego verifica que el modelo este disponible localmente o accesible para tu instalacion de Ollama:

```bash
ollama list
ollama pull minimax-m3:cloud
```

Despues ejecuta la aplicacion con cualquiera de los comandos.

## Comandos

Resumir texto:

```bash
python app.py summarize --text "texto largo..."
```

Extraer tareas pendientes:

```bash
python app.py tasks --text "texto con pendientes..."
```

Ordenar notas:

```bash
python app.py clean --text "notas desordenadas..."
```

Crear una respuesta profesional:

```bash
python app.py professional --text "mensaje informal..."
```

Hacer una pregunta sobre el texto:

```bash
python app.py ask --text "contexto..." --question "Que debo hacer primero?"
```

Leer texto desde un archivo local:

```bash
python app.py summarize --file ./examples/nota.txt
```

## Tests

```bash
pytest
```

Las pruebas cubren lectura de archivos locales y generacion de prompts. No requieren que Ollama este ejecutandose.

## Metodologia SIMPLE usada

La documentacion Specs.md esta en:

```text
specs/localnote-ai/
├── requirements.md
├── design.md
└── tasks.md
```

El flujo aplicado fue:

1. Definir que debe hacer la aplicacion en `requirements.md`.
2. Disenar modulos, flujo de datos y manejo de errores en `design.md`.
3. Convertir el diseno en tareas verificables en `tasks.md`.
4. Implementar el proyecto siguiendo esas tareas.

## Limitaciones

- La calidad de las respuestas depende del modelo configurado en Ollama.
- La aplicacion no guarda historial de consultas.
- Solo lee archivos de texto UTF-8.
- No tiene interfaz grafica ni servidor web.
- No ejecuta pruebas de integracion contra Ollama para mantener los tests locales y rapidos.
