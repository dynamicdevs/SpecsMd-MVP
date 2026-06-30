# 04 · Design — IdeaForge Local

## Estructura del proyecto

```text
ideaforge-local/
├── app.py
├── requirements.txt
├── README.md
├── .env.example
├── examples/
│   ├── idea.txt
│   └── multiple_ideas.txt
├── outputs/
│   └── .gitkeep
├── src/
│   ├── __init__.py
│   ├── ai_client.py
│   ├── config.py
│   ├── file_loader.py
│   ├── output_writer.py
│   └── prompts.py
├── tests/
│   ├── test_file_loader.py
│   ├── test_output_writer.py
│   └── test_prompts.py
└── specs/
    └── ideaforge-local/
        ├── 00_brainstorm.md
        ├── 01_opportunities.md
        ├── 02_selected_idea.md
        ├── 03_requirements.md
        ├── 04_design.md
        └── 05_tasks.md
```

## Flujo de ejecución

```text
app.py (argparse)
  ├─ valida argumentos (--text | --file, --output, --overwrite)
  ├─ resuelve el texto de entrada (file_loader si --file)
  ├─ carga config (config.py) → modelo + idioma
  ├─ construye el prompt según el modo (prompts.py)
  ├─ llama a Ollama (ai_client.py) → texto de salida
  └─ imprime y/o guarda (output_writer.py si --output)
```

## Módulos

### `app.py` — Punto de entrada CLI
- Define el parser con argparse: subcomandos `ideate`, `compare`, `mvp`, `brief`.
- Argumentos comunes por subcomando: `--text`, `--file`, `--output`, `--overwrite`.
- Valida que se entregue exactamente una fuente de entrada (`--text` XOR `--file`).
- Orquesta: entrada → config → prompt → ai_client → salida.
- Captura excepciones de dominio y muestra mensajes limpios (sin stack trace). Devuelve código de salida ≠ 0 en error.

### `src/config.py` — Configuración
- Carga `.env` con `python-dotenv`.
- `OLLAMA_MODEL` (por defecto `minimax-m3:cloud`).
- `DEFAULT_LANGUAGE` (por defecto `es`).
- Expone un objeto/función simple `load_config()` que devuelve modelo e idioma.

### `src/ai_client.py` — Cliente Ollama
- Encapsula `from ollama import chat`.
- Función `generate(model, prompt) -> str` que envía un único mensaje de usuario y devuelve `response.message.content`.
- Maneja errores de conexión / modelo no disponible lanzando un error de dominio (`AIClientError`) con mensaje entendible.
- **No** contiene lógica de prompts.

### `src/prompts.py` — Construcción de prompts
- Una función por modo, todas reciben `text` e `language`:
  - `build_ideate_prompt(text, language)`
  - `build_compare_prompt(text, language)`
  - `build_mvp_prompt(text, language)`
  - `build_brief_prompt(text, language)`
- Cada prompt instruye al modelo a responder **en el idioma configurado** y a usar la **plantilla Markdown** específica del modo (ver formatos abajo).
- Funciones puras (sin I/O, sin red) → fácilmente testeables.

### `src/file_loader.py` — Lectura de archivos
- `load_text(path) -> str`: valida que el archivo exista y sea archivo regular; lee en UTF-8; devuelve texto limpio (`strip`).
- Lanza `FileLoaderError` con mensaje claro si no existe o está vacío.
- No accede a rutas distintas de la indicada por el usuario.

### `src/output_writer.py` — Escritura de salida
- `write_output(path, content, overwrite=False) -> str`: crea la carpeta destino si no existe; escribe en UTF-8.
- Si el archivo existe y `overwrite=False` → lanza `OutputWriterError`.
- Devuelve la ruta escrita.

## Errores de dominio

Excepciones propias para que `app.py` muestre mensajes limpios:
- `FileLoaderError`
- `OutputWriterError`
- `AIClientError`

## Formatos de salida (plantillas en los prompts)

**`ideate`** → `# Idea ordenada` con: Resumen · Problema que resuelve · Usuario objetivo · Propuesta de valor · Funcionalidades posibles · Riesgos · MVP recomendado · Próximos pasos.

**`compare`** → `# Comparación de ideas` con: Ideas detectadas · Criterios de evaluación · Comparación · Idea recomendada · Justificación · Riesgos.

**`mvp`** → `# MVP recomendado` con: Idea original · Qué problema mínimo resolver · Funcionalidades esenciales · Funcionalidades que quedan fuera · Primera versión implementable · Criterios de éxito.

**`brief`** → `# Brief técnico inicial` con: Nombre tentativo · Objetivo · Usuario · Flujo principal · Módulos necesarios · Restricciones · Siguiente paso recomendado.

## Dependencias

- `ollama`
- `python-dotenv`
- `pytest` (dev)

Tareas de implementación en [05_tasks.md](05_tasks.md).
