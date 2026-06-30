# Requirements — LocalNote AI

> Fase **REQUISITOS** de la metodología Specs.md (flujo SIMPLE).
> Esta es la primera fase: definir el *qué* y el *por qué* antes de diseñar o implementar.

## 1. Propósito del proyecto

**LocalNote AI** es una aplicación de consola en Python que permite tomar una nota
o un texto largo y procesarlo con un modelo de IA ejecutado de forma **100% local**
a través de [Ollama](https://ollama.com).

El objetivo doble es:

1. **Funcional**: ofrecer un asistente de texto útil y privado que resuma, extraiga
   tareas, ordene notas, redacte respuestas profesionales y responda preguntas sobre
   un texto, sin enviar datos a ningún servicio externo.
2. **Didáctico**: servir como laboratorio pequeño para aplicar la metodología SIMPLE
   de Specs.md (requisitos → diseño → tareas → implementación) de principio a fin.

## 2. Usuarios

| Usuario | Descripción | Necesidad principal |
|---------|-------------|---------------------|
| **Usuario de escritorio** | Persona que toma notas y quiere procesarlas con IA sin depender de la nube. | Privacidad + utilidad rápida desde la terminal. |
| **Estudiante de la metodología** | Quien usa este repo para aprender el flujo SIMPLE de Specs.md. | Un ejemplo completo, pequeño y entendible. |
| **Desarrollador** | Quien mantiene o extiende la app. | Código limpio, modular y con tests. |

## 3. Requisitos funcionales (FR)

| ID | Requisito |
|----|-----------|
| FR-1 | La app se ejecuta por consola con `python app.py <comando> [opciones]` usando `argparse`. |
| FR-2 | Comando `summarize`: resume el texto de entrada. |
| FR-3 | Comando `tasks`: extrae las tareas/pendientes del texto. |
| FR-4 | Comando `clean`: convierte notas desordenadas en una versión ordenada. |
| FR-5 | Comando `professional`: crea una respuesta profesional a partir de una idea informal. |
| FR-6 | Comando `ask`: responde una pregunta libre (`--question`) sobre el texto de entrada. |
| FR-7 | El texto se puede entregar con `--text "..."`. |
| FR-8 | El texto se puede leer desde un archivo local con `--file ./ruta.txt` (UTF-8). |
| FR-9 | Si no se pasa ni `--text` ni `--file`, la app muestra un error claro y termina. |
| FR-10 | El comando `ask` exige `--question`; si falta, muestra un error claro. |
| FR-11 | El modelo de IA se obtiene de la variable `OLLAMA_MODEL` del `.env`; si no existe, usa `minimax-m3:cloud` por defecto. |
| FR-12 | La llamada a IA se realiza únicamente con la librería oficial `ollama` (`from ollama import chat`). |
| FR-13 | La salida de la IA se imprime en consola de forma legible. |

## 4. Requisitos no funcionales (NFR)

| ID | Requisito |
|----|-----------|
| NFR-1 | **Local-first**: ninguna funcionalidad depende de servicios externos (salvo el runtime local de Ollama). |
| NFR-2 | **Configurabilidad**: cambiar de modelo se hace solo editando una variable (`OLLAMA_MODEL`), sin tocar código. |
| NFR-3 | **Portabilidad**: pensado para Windows, sin romper compatibilidad con Linux/macOS (rutas y UTF-8 neutrales). |
| NFR-4 | **Simplicidad**: sin sobreingeniería; código entendible y separado por módulos. |
| NFR-5 | **Robustez de errores**: los errores se muestran como mensajes claros; no se imprimen stack traces al usuario final. |
| NFR-6 | **Testeabilidad**: la lógica pura (carga de archivos y generación de prompts) se prueba con `pytest` sin necesidad de Ollama. |
| NFR-7 | **Compatibilidad**: Python 3.11 o superior. |

## 5. Restricciones

- Todo debe funcionar **localmente**.
- **Prohibido**: Gmail, Google Drive, APIs externas, bases de datos remotas, scraping,
  servicios cloud externos, integraciones de terceros.
- **Prohibido**: OpenAI, Anthropic, Gemini o cualquier API externa de IA.
- El **único** acceso de IA permitido es la librería oficial `ollama` para Python.
- Modelo por defecto exacto: **`minimax-m3:cloud`**.
- Almacenamiento solo en **archivos locales**.
- Sin frameworks web (Flask/FastAPI), sin Streamlit, sin base de datos, sin Docker.
- Dependencias permitidas: `ollama`, `python-dotenv`, `pytest`. Nada innecesario.

## 6. Criterios de aceptación

- [ ] `python app.py summarize --text "..."` imprime un resumen.
- [ ] `python app.py tasks --text "..."` imprime una lista de tareas.
- [ ] `python app.py clean --text "..."` imprime las notas ordenadas.
- [ ] `python app.py professional --text "..."` imprime una respuesta profesional.
- [ ] `python app.py ask --text "..." --question "..."` imprime la respuesta a la pregunta.
- [ ] `python app.py summarize --file ./examples/nota.txt` lee el archivo y lo procesa.
- [ ] Ejecutar sin `--text` ni `--file` produce un mensaje de error claro (no un stack trace).
- [ ] Ejecutar `ask` sin `--question` produce un mensaje de error claro.
- [ ] Cambiar `OLLAMA_MODEL` en `.env` cambia el modelo usado, sin modificar código.
- [ ] Si Ollama falla, se muestra un mensaje entendible y la app termina con código != 0.
- [ ] `pytest` pasa en verde sin necesitar un servidor Ollama corriendo.
