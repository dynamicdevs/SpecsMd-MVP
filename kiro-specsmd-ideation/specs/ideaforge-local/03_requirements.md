# 03 · Requirements — IdeaForge Local

## Comandos soportados

```bash
python app.py ideate  --text "Tengo una idea para una app que..."
python app.py ideate  --file ./examples/idea.txt
python app.py compare --text "Idea A: ... Idea B: ..."
python app.py compare --file ./examples/multiple_ideas.txt
python app.py mvp     --text "Idea desordenada..."
python app.py brief   --text "Idea inicial..."
python app.py ideate  --text "Idea..." --output ./outputs/idea_result.md
python app.py ideate  --text "Idea..." --output ./outputs/idea_result.md --overwrite
```

## Requisitos funcionales

- **RF1** Recibir texto desde `--text`.
- **RF2** Recibir texto desde un archivo local con `--file` (UTF-8).
- **RF3** Modo `ideate`: transformar una idea desordenada en una propuesta clara.
- **RF4** Modo `compare`: comparar varias ideas y recomendar una.
- **RF5** Modo `mvp`: reducir una idea grande a un MVP pequeño.
- **RF6** Modo `brief`: generar un brief técnico inicial.
- **RF7** Guardar la salida en un archivo local con `--output`.
- **RF8** Mostrar errores claros si faltan argumentos o son inválidos.
- **RF9** El modelo de IA se configura por variable (`OLLAMA_MODEL`), por defecto `minimax-m3:cloud`.
- **RF10** Respuestas en español por defecto (`DEFAULT_LANGUAGE=es`).

## Requisitos no funcionales

- **RNF1** Código simple y legible.
- **RNF2** Arquitectura modular (responsabilidad única por módulo).
- **RNF3** Fácil de probar (lógica pura testeable sin Ollama).
- **RNF4** Sin dependencias innecesarias.
- **RNF5** Compatible principalmente con Windows; también Linux/macOS si es posible.
- **RNF6** Respuestas en español por defecto.
- **RNF7** El modelo debe poder cambiarse fácilmente desde configuración.

## Restricciones

- **R1** No usar servicios externos (solo Ollama local).
- **R2** No usar OpenAI, Anthropic, Gemini ni APIs externas.
- **R3** No usar base de datos.
- **R4** No usar frameworks web (Streamlit, FastAPI, Flask).
- **R5** No usar Docker.
- **R6** No guardar datos sensibles.
- **R7** No ejecutar código generado por la IA.
- **R8** No permitir lectura de archivos fuera de la ruta indicada explícitamente por el usuario.
- **R9** No sobreingenierizar.

## Manejo de errores

- Si no se entrega `--text` ni `--file` → error claro y código de salida ≠ 0.
- Si se entregan `--text` y `--file` a la vez → error claro (ambiguo).
- Si `--file` no existe o no es legible → error claro.
- Si `--output` ya existe y no hay `--overwrite` → no sobrescribir; error claro.
- Si Ollama falla (no instalado, no corriendo, modelo no disponible) → mensaje entendible.
- No mostrar stack traces al usuario final.

## Criterios de aceptación

- **CA1** El usuario puede pasar una idea por consola y obtener una respuesta estructurada.
- **CA2** El usuario puede leer una idea desde un archivo local.
- **CA3** El usuario puede guardar el resultado en un archivo local.
- **CA4** Los prompts están separados del código principal (`src/prompts.py`).
- **CA5** Los tests básicos pasan con `pytest`.
- **CA6** El README explica cómo usar el proyecto.

Diseño técnico en [04_design.md](04_design.md).
