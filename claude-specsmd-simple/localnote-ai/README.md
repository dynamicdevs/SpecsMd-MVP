# LocalNote AI

Aplicación de consola en Python que procesa una nota o texto largo con IA **100% local**
usando [Ollama](https://ollama.com). Resume, extrae tareas, ordena notas, redacta respuestas
profesionales y responde preguntas sobre un texto — sin enviar datos a ningún servicio externo.

Construida como laboratorio de la metodología **SIMPLE** de Specs.md
(requisitos → diseño → tareas → implementación). Ver [`specs/localnote-ai/`](specs/localnote-ai/).

## Requisitos

- **Python 3.11 o superior**
- [Ollama](https://ollama.com) instalado y corriendo localmente
- Dependencias Python: `ollama`, `python-dotenv`, `pytest`

## Instalación

```bash
# (Opcional) crear y activar un entorno virtual
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

## Configuración

El modelo se define en un archivo `.env` (no se toca el código para cambiarlo):

```bash
# Copiar la plantilla
# Windows
copy .env.example .env
# Linux / macOS
cp .env.example .env
```

Contenido de `.env`:

```env
OLLAMA_MODEL=minimax-m3:cloud
```

Si no existe `.env` o la variable está vacía, se usa el modelo por defecto
`minimax-m3:cloud`. Para cambiar de modelo, edita solo `OLLAMA_MODEL`.

## Cómo ejecutar Ollama

1. Instala Ollama desde https://ollama.com
2. Asegúrate de que el servicio esté corriendo:

   ```bash
   ollama serve
   ```

3. Asegúrate de tener disponible el modelo configurado (`minimax-m3:cloud` por defecto).

## Cómo correr cada comando

La app recibe el texto con `--text "..."` **o** desde un archivo con `--file ./ruta.txt`.

```bash
# Resumir texto
python app.py summarize --text "texto largo..."

# Extraer tareas pendientes
python app.py tasks --text "texto con pendientes..."

# Ordenar notas desordenadas
python app.py clean --text "notas desordenadas..."

# Crear una respuesta profesional a partir de una idea informal
python app.py professional --text "mensaje informal..."

# Hacer una pregunta libre sobre el texto (requiere --question)
python app.py ask --text "contexto..." --question "¿Qué debo hacer primero?"

# Leer el texto desde un archivo local
python app.py summarize --file ./examples/nota.txt
```

### Comportamiento

- Si pasas `--text`, se procesa ese texto.
- Si pasas `--file`, se lee el contenido desde el archivo local (UTF-8).
- Si no pasas ni `--text` ni `--file`, se muestra un error claro.
- El comando `ask` exige también `--question`.
- Si Ollama falla, se muestra un mensaje entendible (sin stack traces).

## Cómo correr los tests

Los tests cubren la lógica pura (carga de archivos y generación de prompts) y **no**
requieren que Ollama esté corriendo:

```bash
pytest
```

## Metodología SIMPLE (Specs.md)

Este proyecto se construyó siguiendo el flujo SIMPLE de Specs.md, en este orden:

1. **Requisitos** — [`specs/localnote-ai/requirements.md`](specs/localnote-ai/requirements.md):
   propósito, usuarios, requisitos funcionales y no funcionales, restricciones y criterios
   de aceptación.
2. **Diseño** — [`specs/localnote-ai/design.md`](specs/localnote-ai/design.md):
   arquitectura, flujo de datos, módulos internos, conexión con Ollama, manejo de errores
   y decisiones técnicas.
3. **Tareas** — [`specs/localnote-ai/tasks.md`](specs/localnote-ai/tasks.md):
   lista de tareas pequeñas, verificables y ordenadas, desde el setup hasta las pruebas.
4. **Implementación** — el código de `app.py` y `src/` sigue esos documentos.

## Estructura del proyecto

```
localnote-ai/
├── app.py                  # CLI + orquestación (toda la I/O)
├── requirements.txt
├── README.md
├── .env.example
├── examples/
│   └── nota.txt
├── src/
│   ├── __init__.py
│   ├── ai_client.py        # encapsula la llamada a Ollama (único punto que usa `ollama`)
│   ├── config.py           # modelo desde .env (default: minimax-m3:cloud)
│   ├── prompts.py          # prompts por modo
│   └── file_loader.py      # lectura de archivos UTF-8
├── tests/
│   ├── test_file_loader.py
│   └── test_prompts.py
└── specs/localnote-ai/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

## Limitaciones

- Requiere Ollama instalado y corriendo localmente; la app no descarga modelos por ti.
- No persiste historial ni sesiones: cada ejecución es independiente.
- Cada comando envía una sola petición (sin conversación multi-turno).
- Sin interfaz gráfica ni web: es una herramienta de consola.
- La calidad de la respuesta depende del modelo local configurado.
- No usa APIs externas, bases de datos, cloud ni integraciones de terceros (por diseño).
