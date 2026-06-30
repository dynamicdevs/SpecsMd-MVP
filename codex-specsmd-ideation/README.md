# IdeaForge Local

IdeaForge Local es una aplicacion Python local de consola que usa Ollama para transformar ideas desordenadas en propuestas claras de proyecto. Sirve como laboratorio pequeno para practicar una metodologia de ideacion antes de implementar codigo.

## Que problema resuelve

Cuando una idea todavia esta mezclada, suele ser dificil saber que problema resuelve, para quien es, que MVP conviene construir y cual seria el siguiente paso tecnico. IdeaForge Local ordena esa primera materia prima y la devuelve en Markdown.

## Metodologia Ideation aplicada

El proyecto fue definido antes de implementar codigo mediante seis documentos:

- `specs/ideaforge-local/00_brainstorm.md`
- `specs/ideaforge-local/01_opportunities.md`
- `specs/ideaforge-local/02_selected_idea.md`
- `specs/ideaforge-local/03_requirements.md`
- `specs/ideaforge-local/04_design.md`
- `specs/ideaforge-local/05_tasks.md`

El flujo fue: expandir la idea, comparar variantes, elegir una version pequena, definir requisitos, disenar la arquitectura y recien despues implementar.

## Requisitos

- Python 3.11 o superior.
- Ollama instalado y disponible localmente.
- Modelo por defecto: `minimax-m3:cloud`.

## Instalacion

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

En Linux/macOS:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Configuracion

Crea un archivo `.env` a partir de `.env.example` si quieres cambiar configuracion:

```env
OLLAMA_MODEL=minimax-m3:cloud
DEFAULT_LANGUAGE=es
```

El modelo puede cambiarse modificando `OLLAMA_MODEL`.

## Uso

```bash
python app.py ideate --text "Quiero crear una app para ordenar mis ideas de proyectos con IA"
python app.py ideate --file ./examples/idea.txt
python app.py compare --file ./examples/multiple_ideas.txt
python app.py mvp --text "Tengo una idea gigante para una plataforma de productividad"
python app.py brief --text "Una app local para transformar ideas en proyectos"
python app.py ideate --text "Idea..." --output ./outputs/idea_result.md
```

Para sobrescribir un archivo de salida existente:

```bash
python app.py ideate --text "Idea..." --output ./outputs/idea_result.md --overwrite
```

## Modos

- `ideate`: ordena una idea desordenada.
- `compare`: compara varias ideas y recomienda una.
- `mvp`: reduce una idea grande a una primera version implementable.
- `brief`: genera un brief tecnico inicial.

## Tests

```bash
pytest
```

## Limitaciones

- No usa servicios externos ni APIs de IA externas.
- No tiene interfaz web.
- No guarda historial automatico.
- No usa base de datos.
- No ejecuta codigo generado por IA.
- La calidad de la salida depende del modelo local configurado en Ollama.

## Mejoras futuras

- Agregar plantillas de prompt editables por archivo.
- Agregar historial local opcional por fecha.
- Agregar mas tests de CLI con mocks de Ollama.
- Permitir elegir idioma por argumento de consola.
