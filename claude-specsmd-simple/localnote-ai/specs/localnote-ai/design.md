# Design — LocalNote AI

> Fase **DISEÑO** de la metodología Specs.md (flujo SIMPLE).
> Segunda fase: definir el *cómo* a partir de los requisitos, antes de escribir código.

## 1. Arquitectura simple

LocalNote AI es una CLI monolítica con una separación clara entre **I/O** (que vive en
`app.py`) y la **lógica/módulos** (que vive en `src/`). No hay capas innecesarias: solo
las piezas mínimas para cumplir los requisitos.

```
                ┌────────────────────────────────────────────┐
                │                  app.py                     │
                │  (CLI: argparse, orquestación, manejo de    │
                │   errores, impresión por consola)           │
                └───────┬───────────┬───────────┬─────────────┘
                        │           │           │
            ┌───────────▼──┐  ┌─────▼──────┐  ┌─▼───────────┐
            │ file_loader  │  │  prompts   │  │  ai_client  │
            │ (lee .txt    │  │ (construye │  │ (llama a    │
            │  UTF-8)      │  │  prompts)  │  │  Ollama)    │
            └──────────────┘  └────────────┘  └─────┬───────┘
                                                    │
                              ┌──────────┐    ┌──────▼───────┐
                              │  config  │◄───┤   ollama     │
                              │ (.env →  │    │ (chat local) │
                              │  modelo) │    └──────────────┘
                              └──────────┘
```

**Principio de diseño**: `src/` no imprime ni parsea argumentos; `app.py` no construye
prompts ni habla con Ollama directamente. Cada módulo tiene una sola responsabilidad.

## 2. Flujo de datos

```
1. Usuario ejecuta:  python app.py <comando> [--text | --file] [--question]
2. app.py parsea argumentos con argparse.
3. app.py resuelve el TEXTO de entrada:
      --text  → usa el string directamente
      --file  → file_loader.load_text_file(ruta) → contenido UTF-8
      ninguno → error claro, salida con código != 0
4. app.py construye los MENSAJES con prompts.build_messages(comando, texto, pregunta).
5. app.py obtiene el MODELO con config.get_model() (.env o default minimax-m3:cloud).
6. app.py llama a ai_client.run_chat(model, messages).
7. ai_client usa `from ollama import chat` y devuelve el texto de la respuesta.
8. app.py imprime la respuesta. Si algo falla, imprime un mensaje claro.
```

## 3. Módulos internos

| Módulo | Responsabilidad | Funciones públicas (contrato) |
|--------|-----------------|-------------------------------|
| `src/config.py` | Cargar configuración desde `.env`. | `get_model() -> str` (devuelve `OLLAMA_MODEL` o `minimax-m3:cloud`). |
| `src/file_loader.py` | Leer texto de archivos locales en UTF-8. | `load_text_file(path: str) -> str` (lanza `FileLoaderError` si no existe / vacío). |
| `src/prompts.py` | Construir los prompts/mensajes según el modo. | `build_messages(mode, text, question=None) -> list[dict]`; funciones por modo: `summarize_prompt`, `tasks_prompt`, `clean_prompt`, `professional_prompt`, `ask_prompt`. |
| `src/ai_client.py` | Encapsular la llamada a Ollama. | `run_chat(model: str, messages: list[dict]) -> str` (lanza `AIClientError` ante fallos). |
| `app.py` | CLI, orquestación, manejo de errores y salida. | `main()`. |

### Decisiones de contrato

- **Modos soportados**: `summarize`, `tasks`, `clean`, `professional`, `ask`.
- `prompts.build_messages` devuelve la lista `messages` lista para `ollama.chat`
  (formato `[{'role': 'user', 'content': ...}]`), de modo que `ai_client` quede agnóstico
  al modo.
- Para `ask`, el prompt combina el **contexto** (texto) y la **pregunta** en un solo mensaje.

## 4. Conexión con Ollama

`src/ai_client.py` es el **único** punto que importa y usa `ollama`. La llamada base es:

```python
from ollama import chat

response = chat(
    model='minimax-m3:cloud',
    messages=[{'role': 'user', 'content': 'Hello!'}],
)
print(response.message.content)
```

Encapsulación:

- `run_chat(model, messages)` ejecuta `chat(model=model, messages=messages)` y devuelve
  `response.message.content`.
- Cualquier excepción de la librería o de conexión se captura y se re-lanza como
  `AIClientError` con un mensaje entendible (p. ej. "No se pudo contactar con Ollama.
  ¿Está corriendo `ollama serve` y el modelo descargado?").
- Aislar Ollama aquí permite (a) cumplir NFR-6 (los tests no necesitan Ollama) y
  (b) cambiar el backend en un solo archivo si hiciera falta.

## 5. Manejo de errores

| Situación | Excepción interna | Comportamiento hacia el usuario |
|-----------|-------------------|----------------------------------|
| No se pasa `--text` ni `--file` | (validación en `app.py`) | Mensaje claro + exit code 2 (error de uso de argparse). |
| `ask` sin `--question` | (validación en `app.py`) | Mensaje claro + exit code 2. |
| Archivo inexistente / no legible / vacío | `FileLoaderError` | Mensaje claro: "No se pudo leer el archivo: ...". exit 1. |
| Fallo de Ollama (no corriendo, modelo no disponible, etc.) | `AIClientError` | Mensaje claro y accionable. exit 1. |

**Regla (NFR-5)**: `app.py` envuelve la orquestación en un `try/except` que captura
`FileLoaderError` y `AIClientError`, imprime el mensaje y sale con código != 0.
**No** se muestran stack traces al usuario final.

## 6. Decisiones técnicas

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| Interfaz | CLI con `argparse` + subcomandos | Pedido explícito; cero dependencias extra; portable. |
| Acceso IA | Librería oficial `ollama` | Única vía permitida; local-first. |
| Config | `python-dotenv` + `os.environ` | Cambiar modelo sin tocar código (NFR-2). |
| Default modelo | `minimax-m3:cloud` (constante en `config.py`) | Requisito exacto. |
| Encoding | UTF-8 explícito en lectura de archivos | Portabilidad Windows/Linux/macOS (NFR-3). |
| Errores | Excepciones propias (`FileLoaderError`, `AIClientError`) capturadas en `app.py` | Mensajes claros, sin stack traces (NFR-5). |
| Tests | `pytest` sobre `file_loader` y `prompts` (lógica pura) | Cubrir sin depender de Ollama (NFR-6). |
| Estructura | `app.py` (I/O) + `src/` (lógica) | Separación de responsabilidades, simple y extensible. |

## 7. Estructura de archivos

```
localnote-ai/
├── app.py                  # CLI + orquestación
├── requirements.txt        # ollama, python-dotenv, pytest
├── README.md
├── .env.example            # OLLAMA_MODEL=minimax-m3:cloud
├── examples/
│   └── nota.txt
├── src/
│   ├── __init__.py
│   ├── ai_client.py        # encapsula Ollama
│   ├── config.py           # modelo desde .env
│   ├── prompts.py          # prompts por modo
│   └── file_loader.py      # lectura UTF-8
├── tests/
│   ├── test_file_loader.py
│   └── test_prompts.py
└── specs/localnote-ai/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```
