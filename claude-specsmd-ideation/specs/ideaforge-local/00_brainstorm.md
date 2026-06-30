# 00 · Brainstorm — IdeaForge Local

## Idea base

> "Una aplicación local que recibe una idea desordenada y ayuda a convertirla en una propuesta clara de proyecto usando IA local con Ollama."

## Expansión de la idea

Muchas buenas ideas mueren en estado "borrador mental": notas sueltas, mensajes a uno mismo, frases inconexas. Falta el paso de **destilación**: convertir ese ruido en algo accionable (problema, usuario, valor, MVP).

IdeaForge Local es una herramienta de consola que actúa como un "facilitador de ideación" personal. El usuario vuelca su idea cruda y la IA local (Ollama) devuelve una estructura ordenada y reutilizable, guardada como Markdown en disco. Todo ocurre en la máquina del usuario, sin nube ni cuentas.

No es un generador de código ni un gestor de proyectos. Es el **paso 0** del desarrollo: pensar antes de construir.

## Enfoques posibles

1. **CLI por modos (elegido como base).** Un solo `app.py` con subcomandos (`ideate`, `compare`, `mvp`, `brief`). Simple, scriptable, sin UI.
2. **REPL interactivo.** Una sesión conversacional que va refinando la idea por turnos. Más rico, pero más estado y complejidad.
3. **Watcher de carpeta.** Observa una carpeta de notas y procesa archivos nuevos. Útil pero introduce magia implícita y procesos en segundo plano.
4. **Plantillas + relleno.** La IA solo rellena huecos de una plantilla fija. Predecible pero rígido.
5. **Pipeline encadenado.** `ideate → mvp → brief` automático en un solo paso. Potente, pero acopla fases que conviene mantener separadas para practicar ideación.

El enfoque **1 (CLI por modos)** equilibra simplicidad, control y valor pedagógico: cada modo es una fase de ideación independiente y verificable.

## Usuarios posibles

- Desarrolladores que acumulan ideas y nunca las estructuran.
- Estudiantes que practican metodología de ideación con IA.
- Emprendedores en etapa muy temprana (pre-MVP).
- Creadores de contenido técnico que necesitan ordenar conceptos.
- Quien quiera trabajar offline / con datos privados sin enviarlos a la nube.

## Problemas que resuelve

- Ideas crudas que nunca pasan a un formato accionable.
- Dificultad para identificar problema, usuario y propuesta de valor.
- Tendencia a sobredimensionar el alcance (no saber recortar a un MVP).
- Falta de un brief técnico inicial para arrancar a construir.
- Dependencia de servicios en la nube para tareas de pensamiento privado.

## Casos de uso

- "Tengo esta idea desordenada, ordénamela." → `ideate`
- "Tengo dos o tres ideas, ¿cuál persigo?" → `compare`
- "Mi idea es enorme, ¿cuál es el MVP?" → `mvp`
- "Quiero un brief técnico para empezar." → `brief`
- "Quiero guardar el resultado como `.md` para versionarlo." → `--output`

## Límites del proyecto

- Solo funciona localmente (requiere Ollama instalado y corriendo).
- Calidad de salida limitada por el modelo local configurado.
- No persiste historial ni estado entre ejecuciones (cada comando es atómico).
- No valida la viabilidad real de negocio; estructura, no garantiza.

## Qué NO debe hacer

- No usar OpenAI, Anthropic, Gemini ni ninguna API externa.
- No usar Gmail, Drive, scraping ni integraciones externas.
- No usar bases de datos (locales ni remotas).
- No usar Streamlit, FastAPI, Flask ni Docker.
- No ejecutar código generado por la IA.
- No leer archivos fuera de la ruta indicada explícitamente por el usuario.
- No sobreingenierizar: nada de plugins, colas, microservicios ni capas innecesarias.
