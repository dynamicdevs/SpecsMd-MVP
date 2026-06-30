# Requirements — LocalNote AI

## Propósito

LocalNote AI es una aplicación CLI en Python que permite al usuario ingresar texto (o leerlo desde archivo) y procesarlo con IA local mediante Ollama para obtener respuestas útiles: resúmenes, extracción de tareas, limpieza de notas, profesionalización de mensajes y preguntas libres.

---

## Usuarios

| Usuario | Descripción |
|---------|-------------|
| Desarrollador/Profesional | Persona que trabaja con notas, ideas y textos en su día a día y quiere procesarlos rápidamente con IA sin depender de servicios cloud |

---

## Requisitos Funcionales

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-01 | Resumir texto largo en puntos clave | Alta |
| RF-02 | Extraer tareas pendientes de un texto | Alta |
| RF-03 | Convertir notas desordenadas en versión limpia y estructurada | Alta |
| RF-04 | Crear una respuesta profesional a partir de una idea informal | Alta |
| RF-05 | Hacer una pregunta libre sobre el texto proporcionado | Alta |
| RF-06 | Aceptar texto inline via `--text` | Alta |
| RF-07 | Aceptar texto desde archivo local via `--file` | Alta |
| RF-08 | Mostrar error claro si no se proporciona `--text` ni `--file` | Alta |
| RF-09 | Exigir `--question` cuando se usa el comando `ask` | Alta |
| RF-10 | Mostrar mensajes de error legibles si Ollama falla | Alta |
| RF-11 | Permitir configurar el modelo de IA desde variable de entorno | Media |

---

## Requisitos No Funcionales

| ID | Requisito |
|----|-----------|
| RNF-01 | Todo funciona localmente, sin conexión a internet requerida (excepto Ollama descargando modelo) |
| RNF-02 | Tiempo de respuesta depende del modelo, la app no debe agregar latencia innecesaria |
| RNF-03 | Código modular, separado en archivos con responsabilidad única |
| RNF-04 | Compatible con Windows, Linux y macOS |
| RNF-05 | Sin stack traces al usuario final en caso de errores esperados |

---

## Restricciones

| ID | Restricción |
|----|-------------|
| C-01 | No usar APIs externas (OpenAI, Anthropic, Gemini, etc.) |
| C-02 | No usar frameworks web (FastAPI, Flask, Streamlit, etc.) |
| C-03 | No usar bases de datos |
| C-04 | No usar Docker |
| C-05 | No usar servicios cloud |
| C-06 | Único acceso de IA: librería oficial `ollama` para Python |
| C-07 | Modelo por defecto: `minimax-m3:cloud` |
| C-08 | Python 3.11 o superior |

---

## Criterios de Aceptación

| ID | Criterio |
|----|----------|
| AC-01 | `python app.py summarize --text "texto"` devuelve un resumen |
| AC-02 | `python app.py tasks --text "texto"` devuelve tareas extraídas |
| AC-03 | `python app.py clean --text "texto"` devuelve texto ordenado |
| AC-04 | `python app.py professional --text "texto"` devuelve versión profesional |
| AC-05 | `python app.py ask --text "contexto" --question "pregunta"` devuelve respuesta |
| AC-06 | `python app.py summarize --file ./examples/nota.txt` lee y procesa el archivo |
| AC-07 | Sin `--text` ni `--file` muestra error descriptivo |
| AC-08 | `ask` sin `--question` muestra error descriptivo |
| AC-09 | Si Ollama no está corriendo, muestra mensaje amigable |
| AC-10 | Cambiar `OLLAMA_MODEL` en `.env` cambia el modelo usado |
| AC-11 | `pytest` ejecuta sin errores |
