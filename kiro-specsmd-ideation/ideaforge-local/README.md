# IdeaForge Local

Asistente **local** de ideación con IA. Convierte una idea desordenada en una
propuesta clara, ordenada y accionable, desde la consola y sin salir de tu
máquina. El único acceso de IA es a través de **Ollama**.

## Qué es

Una aplicación de línea de comandos (Python) que toma una idea cruda (texto o
archivo) y devuelve una salida estructurada en Markdown según el modo elegido:

- `ideate` — idea desordenada → propuesta clara.
- `compare` — varias ideas → comparación y recomendación.
- `mvp` — idea grande → MVP pequeño y realista.
- `brief` — idea inicial → brief técnico inicial.

## Qué problema resuelve

Las buenas ideas suelen quedarse como notas sueltas y nunca pasan a un formato
accionable. IdeaForge Local da el **paso 0** del desarrollo: ordenar, evaluar,
recortar a un MVP y aterrizar un brief técnico, **en local y en privado**.

## Cómo se aplicó la metodología Ideation

Antes de escribir código se recorrió una fase de ideación documentada en
[specs/ideaforge-local/](../specs/ideaforge-local/):

1. `00_brainstorm.md` — expansión de la idea, enfoques, usuarios, límites.
2. `01_opportunities.md` — 5 variantes evaluadas (valor, complejidad, riesgo).
3. `02_selected_idea.md` — variante elegida y justificación.
4. `03_requirements.md` — requisitos funcionales, no funcionales y restricciones.
5. `04_design.md` — arquitectura y módulos.
6. `05_tasks.md` — tareas verificables.

Recién después se implementó el proyecto siguiendo esos documentos.

## Requisitos

- Python 3.11 o superior.
- [Ollama](https://ollama.com) instalado y en ejecución.
- El modelo configurado disponible en Ollama (por defecto `minimax-m3:cloud`).

## Instalación

```bash
cd ideaforge-local
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
```

## Configuración

Copia el ejemplo y ajústalo si lo necesitas:

```bash
# Windows
copy .env.example .env
# Linux/macOS
cp .env.example .env
```

`.env`:

```env
OLLAMA_MODEL=minimax-m3:cloud
DEFAULT_LANGUAGE=es
```

Para **cambiar de modelo** basta con editar `OLLAMA_MODEL`. Si no existe `.env`,
se usan los valores por defecto.

## Comandos de uso

```bash
python app.py ideate  --text "Quiero crear una app para ordenar mis ideas con IA"
python app.py ideate  --file ./examples/idea.txt
python app.py compare --file ./examples/multiple_ideas.txt
python app.py mvp     --text "Tengo una idea gigante para una plataforma de productividad"
python app.py brief   --text "Una app local para transformar ideas en proyectos"
python app.py ideate  --text "Idea..." --output ./outputs/idea_result.md
python app.py ideate  --text "Idea..." --output ./outputs/idea_result.md --overwrite
```

Argumentos:

- `--text` — la idea como texto directo.
- `--file` — ruta a un archivo local UTF-8 con la idea (alternativa a `--text`).
- `--output` — guarda la salida en un archivo local.
- `--overwrite` — permite sobrescribir el archivo de salida si ya existe.

La respuesta se imprime siempre por pantalla; con `--output` además se guarda.

## Ejemplos

```bash
# Ordenar una idea desde archivo y guardarla
python app.py ideate --file ./examples/idea.txt --output ./outputs/idea_ordenada.md

# Comparar varias ideas
python app.py compare --file ./examples/multiple_ideas.txt
```

## Cómo correr tests

```bash
pytest
```

Los tests cubren lógica pura (lectura de archivos, construcción de prompts,
escritura de salida) y **no requieren Ollama**.

## Limitaciones

- Requiere Ollama instalado y corriendo; la calidad depende del modelo local.
- No persiste historial ni estado entre ejecuciones (cada comando es atómico).
- No valida la viabilidad real de negocio: estructura la idea, no la garantiza.
- No ejecuta código generado por la IA.

## Qué se podría mejorar después

- Modo REPL conversacional para refinar la idea por turnos.
- Pipeline encadenado `ideate → mvp → brief` en un comando.
- Soporte para múltiples idiomas de salida más allá del configurado.
- Plantillas de salida personalizables por el usuario.
