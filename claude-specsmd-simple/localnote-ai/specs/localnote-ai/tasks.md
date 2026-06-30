# Tasks — LocalNote AI

> Fase **TAREAS** de la metodología Specs.md (flujo SIMPLE).
> Tercera fase: descomponer el diseño en tareas pequeñas, verificables y ordenadas,
> desde el setup inicial hasta las pruebas finales. Cada tarea es un checkbox.

## Fase 0 — Setup inicial

- [ ] T-01: Crear la estructura de carpetas (`src/`, `tests/`, `examples/`, `specs/localnote-ai/`).
- [ ] T-02: Crear `requirements.txt` con `ollama`, `python-dotenv` y `pytest` (sin extras).
- [ ] T-03: Crear `.env.example` con `OLLAMA_MODEL=minimax-m3:cloud`.
- [ ] T-04: Crear `src/__init__.py` (paquete).
- [ ] T-05: Crear `examples/nota.txt` con un texto de ejemplo desordenado y con pendientes.

## Fase 1 — Configuración

- [ ] T-06: Implementar `src/config.py` con `get_model()` que lea `OLLAMA_MODEL` del `.env`
      o devuelva `minimax-m3:cloud` por defecto. **Verificable**: sin `.env` devuelve el default;
      con `OLLAMA_MODEL=otro` devuelve `otro`.

## Fase 2 — Carga de archivos

- [ ] T-07: Implementar `src/file_loader.py` con `load_text_file(path)` que lea UTF-8 y
      defina `FileLoaderError`. **Verificable**: lee un archivo existente; lanza `FileLoaderError`
      si no existe o si está vacío.

## Fase 3 — Prompts

- [ ] T-08: Implementar `src/prompts.py` con una función por modo
      (`summarize_prompt`, `tasks_prompt`, `clean_prompt`, `professional_prompt`, `ask_prompt`).
- [ ] T-09: Implementar `build_messages(mode, text, question=None)` que devuelva la lista
      `messages` para Ollama y valide el modo y, en `ask`, la presencia de `question`.
      **Verificable**: cada modo produce un mensaje no vacío que incluye el texto;
      modo inválido lanza error; `ask` sin pregunta lanza error.

## Fase 4 — Cliente de IA

- [ ] T-10: Implementar `src/ai_client.py` con `run_chat(model, messages)` que use
      `from ollama import chat`, devuelva `response.message.content` y envuelva fallos en
      `AIClientError` con mensaje claro. **Verificable**: la importación de `ollama` está
      aislada aquí; los errores se traducen a `AIClientError`.

## Fase 5 — CLI

- [ ] T-11: Implementar `app.py` con `argparse` y los subcomandos
      `summarize`, `tasks`, `clean`, `professional`, `ask`.
- [ ] T-12: Añadir las opciones `--text`, `--file` (mutuamente sustituibles) y `--question`
      (solo `ask`).
- [ ] T-13: Resolver el texto de entrada (text vs file) y validar:
      sin text ni file → error claro; `ask` sin `--question` → error claro.
- [ ] T-14: Orquestar el flujo (config → prompts → ai_client) y envolver en `try/except`
      para mostrar mensajes claros sin stack traces; salir con código != 0 ante error.
      **Verificable**: los criterios de aceptación de `requirements.md` se cumplen manualmente.

## Fase 6 — Documentación

- [ ] T-15: Escribir `README.md` (descripción, requisitos, instalación, configuración,
      cómo correr Ollama, comandos, tests, metodología SIMPLE y limitaciones).

## Fase 7 — Pruebas finales

- [ ] T-16: Escribir `tests/test_file_loader.py` (lectura OK, archivo inexistente, archivo vacío).
- [ ] T-17: Escribir `tests/test_prompts.py` (cada modo, modo inválido, `ask` sin pregunta).
- [ ] T-18: Ejecutar `pytest` y corregir hasta que pase en verde **sin** necesitar Ollama.
- [ ] T-19: Verificación manual de los comandos de ejemplo (smoke test de la CLI).
