# Tasks — LocalNote AI

## Setup Inicial

- [x] Crear estructura de carpetas del proyecto
- [x] Crear `requirements.txt` con dependencias
- [x] Crear `.env.example` con configuración por defecto
- [x] Crear `examples/nota.txt` con texto de ejemplo

## Módulos Core

- [x] Implementar `src/__init__.py`
- [x] Implementar `src/config.py` — carga modelo desde .env
- [x] Implementar `src/file_loader.py` — lectura de archivos UTF-8
- [x] Implementar `src/prompts.py` — generación de prompts por modo
- [x] Implementar `src/ai_client.py` — llamada a Ollama encapsulada

## Aplicación Principal

- [x] Implementar `app.py` — CLI con argparse y 5 comandos
- [x] Validar que se provea --text o --file
- [x] Validar que ask requiera --question
- [x] Manejar errores de Ollama con mensajes amigables
- [x] Manejar errores de archivo con mensajes amigables

## Tests

- [x] Implementar `tests/test_file_loader.py`
- [x] Implementar `tests/test_prompts.py`

## Documentación

- [x] Crear `README.md` completo con instrucciones
- [x] Documentar todos los comandos disponibles
- [x] Documentar instalación y configuración

## Verificación Final

- [x] Ejecutar pytest y validar que pasa
- [x] Verificar estructura de archivos completa
