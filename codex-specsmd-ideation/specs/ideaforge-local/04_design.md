# IdeaForge Local - Design

## Arquitectura general

IdeaForge Local sera una CLI pequena en Python. `app.py` se encarga de parsear argumentos, validar entrada y coordinar los modulos internos. La logica de conexion con Ollama, configuracion, prompts, lectura de archivos y escritura de resultados vive en `src/`.

## Estructura esperada

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

## Modulos

### `app.py`

- Punto de entrada CLI.
- Usa `argparse`.
- Define subcomandos `ideate`, `compare`, `mvp` y `brief`.
- Valida que exista exactamente una fuente de entrada entre `--text` y `--file`.
- Llama a `file_loader`, `prompts`, `ai_client` y `output_writer`.
- Captura errores esperados y evita stack traces innecesarios.

### `src/config.py`

- Carga variables desde `.env` usando `python-dotenv`.
- Define `OLLAMA_MODEL` con valor por defecto `minimax-m3:cloud`.
- Define `DEFAULT_LANGUAGE` con valor por defecto `es`.
- Expone una funcion simple para obtener configuracion.

### `src/ai_client.py`

- Encapsula la llamada a Ollama.
- Usa el formato base:

```python
from ollama import chat

response = chat(
    model='minimax-m3:cloud',
    messages=[{'role': 'user', 'content': 'Hello!'}],
)

print(response.message.content)
```

- Maneja errores de conexion o modelo no disponible.
- No mezcla logica de prompts con logica de conexion.

### `src/prompts.py`

- Contiene funciones para construir prompts.
- Funciones requeridas:
  - `build_ideate_prompt`
  - `build_compare_prompt`
  - `build_mvp_prompt`
  - `build_brief_prompt`
- Cada prompt exige salida Markdown y respuestas en espanol por defecto.

### `src/file_loader.py`

- Lee archivos locales en UTF-8.
- Valida que el archivo exista.
- Valida que la ruta sea un archivo.
- Devuelve texto limpio.

### `src/output_writer.py`

- Guarda respuestas en archivos locales.
- Crea la carpeta de salida si no existe.
- Evita sobrescribir archivos accidentalmente.
- Permite sobrescribir solo si `overwrite=True`.

## Manejo de errores

- Falta `--text` y `--file`: error claro de CLI.
- Se entregan ambos `--text` y `--file`: error claro de CLI.
- Archivo inexistente: mensaje claro.
- Archivo de salida existente sin `--overwrite`: mensaje claro.
- Falla de Ollama: mensaje entendible que sugiera revisar que Ollama este instalado, corriendo y que el modelo exista.

## Estrategia de testing

- Tests unitarios para lectura de archivos.
- Tests unitarios para escritura de archivos y proteccion contra sobrescritura.
- Tests unitarios para prompts y secciones esperadas.
- Validaciones simples del parser CLI si el alcance lo permite.

## Decisiones de simplicidad

- No habra clases innecesarias.
- No habra base de datos.
- No habra servidor local.
- No habra configuracion compleja.
- No se persistira historial automatico.
- Los outputs se guardaran solo cuando el usuario use `--output`.
