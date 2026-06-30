# IdeaForge Local - Requirements

## Objetivo

Construir una aplicacion Python local, ejecutable desde consola, que use Ollama para transformar ideas desordenadas en salidas estructuradas de ideacion, comparacion, MVP y brief tecnico.

## Comandos esperados

```bash
python app.py ideate --text "Tengo una idea para una app que..."
python app.py ideate --file ./examples/idea.txt
python app.py compare --text "Idea A: ... Idea B: ..."
python app.py mvp --text "Idea desordenada..."
python app.py brief --text "Idea inicial..."
python app.py ideate --text "Idea..." --output ./outputs/idea_result.md
```

## Requisitos funcionales

- Recibir texto desde `--text`.
- Recibir texto desde un archivo local con `--file`.
- Modo `ideate`: transformar una idea desordenada en una propuesta clara.
- Modo `compare`: comparar varias ideas y recomendar una.
- Modo `mvp`: reducir una idea grande a un MVP pequeno.
- Modo `brief`: generar un brief tecnico inicial.
- Permitir guardar la salida en un archivo local usando `--output`.
- Evitar sobrescribir archivos existentes salvo que el usuario use `--overwrite`.
- Mostrar errores claros si faltan argumentos.
- Mostrar errores claros si el archivo de entrada no existe.
- Mostrar un mensaje entendible si Ollama falla.

## Requisitos no funcionales

- Codigo simple.
- Arquitectura modular.
- Facil de probar.
- Sin dependencias innecesarias.
- Compatible principalmente con Windows.
- Compatible tambien con Linux/macOS si es posible.
- Respuestas en espanol por defecto.
- Python 3.11 o superior.

## Restricciones

- No usar servicios externos.
- No usar OpenAI, Anthropic, Gemini ni APIs externas.
- No usar base de datos.
- No usar frameworks web.
- No usar Docker.
- No guardar datos sensibles deliberadamente.
- No ejecutar codigo generado por IA.
- No permitir lectura de archivos fuera de la ruta indicada explicitamente por el usuario.
- Usar la libreria oficial `ollama` para Python.
- Modelo por defecto: `minimax-m3:cloud`.

## Criterios de aceptacion

- El usuario puede pasar una idea por consola y obtener una respuesta estructurada.
- El usuario puede leer una idea desde archivo local.
- El usuario puede guardar el resultado en un archivo local.
- Los prompts estan separados del codigo principal.
- Los tests basicos pasan con `pytest`.
- El README explica como usar el proyecto.
- El modelo puede cambiarse facilmente con una variable de configuracion.
- `.env.example` incluye `OLLAMA_MODEL=minimax-m3:cloud` y `DEFAULT_LANGUAGE=es`.
