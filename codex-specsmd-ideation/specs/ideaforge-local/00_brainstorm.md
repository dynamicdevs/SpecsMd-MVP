# IdeaForge Local - Brainstorm

## Idea base

"Una aplicacion local que recibe una idea desordenada y ayuda a convertirla en una propuesta clara de proyecto usando IA local con Ollama."

## Expansion de la idea

IdeaForge Local sera una herramienta de consola para personas que tienen ideas iniciales, incompletas o demasiado grandes y necesitan convertirlas en material mas accionable. La aplicacion no busca reemplazar el criterio del usuario: actua como una mesa de trabajo local que ordena, resume, pregunta implicitamente por lo importante y propone una primera bajada tecnica.

La herramienta puede recibir una idea escrita directamente en consola o leida desde un archivo local. Luego usa Ollama con un modelo configurable para generar salidas en espanol, con formato Markdown, que el usuario pueda leer, guardar y reutilizar como punto de partida para especificaciones posteriores.

## Enfoques posibles

1. **Asistente de ideacion general**
   - Toma una idea desordenada y devuelve una propuesta clara.
   - Sirve para proyectos, apps, negocios o funcionalidades.

2. **Reductor de alcance MVP**
   - Parte desde una idea grande y recomienda la primera version implementable.
   - Ayuda a evitar sobreingenieria y exceso de funcionalidades.

3. **Comparador de ideas**
   - Recibe varias ideas y las compara por valor, complejidad, riesgos y claridad.
   - Recomienda una idea para avanzar.

4. **Generador de brief tecnico**
   - Convierte una idea inicial en una descripcion tecnica breve.
   - Identifica flujo principal, modulos, restricciones y siguiente paso.

5. **Laboratorio de prompts locales**
   - Permite practicar patrones de prompts de ideacion y evaluar sus resultados.
   - Mantiene prompts separados del codigo principal.

## Usuarios posibles

- Desarrolladores que quieren transformar ideas vagas en tareas implementables.
- Estudiantes que practican desarrollo asistido con IA sin depender de APIs externas.
- Emprendedores tecnicos que necesitan bajar ideas a MVP.
- Product builders que quieren comparar variantes antes de invertir tiempo.
- Personas que desean experimentar con Ollama y flujos locales de IA.

## Problemas que resuelve

- Ideas demasiado ambiguas para empezar a programar.
- Falta de estructura para evaluar si una idea conviene.
- Tendencia a construir demasiado antes de aclarar el MVP.
- Dependencia de herramientas SaaS o APIs externas para idear con IA.
- Dificultad para convertir una idea en un brief tecnico inicial.

## Casos de uso

- Escribir una idea suelta y obtener una propuesta ordenada.
- Leer una idea desde `examples/idea.txt` y guardar el resultado en `outputs/`.
- Comparar dos o mas ideas descritas en un archivo local.
- Reducir una plataforma grande a una primera version posible.
- Generar un mini brief tecnico para preparar una implementacion posterior.

## Limites del proyecto

- Debe ejecutarse desde consola.
- Debe funcionar localmente.
- Debe usar solo Ollama como acceso de IA.
- Debe guardar resultados en archivos locales cuando el usuario lo pida.
- Debe mantener una arquitectura pequena y comprensible.
- Debe priorizar Windows, sin bloquear Linux/macOS.

## Cosas que NO debe hacer

- No debe usar OpenAI, Anthropic, Gemini ni APIs externas.
- No debe usar Gmail, Google Drive, scraping ni integraciones externas.
- No debe usar Streamlit, FastAPI, Flask, Docker ni bases de datos.
- No debe tener login, usuarios, pagos ni nube.
- No debe ejecutar codigo generado por IA.
- No debe guardar datos sensibles deliberadamente.
- No debe leer archivos que el usuario no indique explicitamente.
- No debe convertir la herramienta en una plataforma compleja.
