# 01 · Opportunities — Variantes de IdeaForge Local

A continuación, 5 variantes posibles del proyecto. Todas son **simples y locales**: sin SaaS, login, pagos, nube ni integraciones externas.

---

## Variante A — Asistente de ideación por modos (CLI)

- **Descripción corta:** CLI con subcomandos (`ideate`, `compare`, `mvp`, `brief`) que transforma ideas crudas en propuestas estructuradas usando Ollama.
- **Usuario objetivo:** Desarrollador/estudiante que quiere ordenar ideas desde la consola.
- **Problema que resuelve:** Ideas crudas que nunca pasan a formato accionable.
- **Complejidad técnica:** Baja. argparse + cliente Ollama + plantillas de prompt + I/O de archivos.
- **Valor práctico:** Alto. Cada modo es una fase real de ideación, scriptable y guardable.
- **Riesgos:** Calidad dependiente del modelo local; sin estado entre ejecuciones.
- **Motivo:** ✅ **Elegir.** Cumple todas las restricciones, es pequeña, modular y didáctica.

---

## Variante B — REPL conversacional de refinamiento

- **Descripción corta:** Sesión interactiva por turnos que va puliendo la idea con preguntas y respuestas.
- **Usuario objetivo:** Quien prefiere refinar iterativamente conversando.
- **Problema que resuelve:** Refinamiento progresivo de una idea ambigua.
- **Complejidad técnica:** Media. Maneja historial de conversación, estado de sesión y bucle de entrada.
- **Valor práctico:** Alto, pero solapado con la variante A.
- **Riesgos:** Estado conversacional, manejo de contexto largo, más difícil de testear.
- **Motivo:** ❌ **Descartar (por ahora).** Añade complejidad de estado que contradice "no sobreingenierizar". Buen candidato a mejora futura.

---

## Variante C — Watcher de carpeta de notas

- **Descripción corta:** Proceso que observa una carpeta y procesa cada nota nueva automáticamente.
- **Usuario objetivo:** Quien toma muchas notas sueltas.
- **Problema que resuelve:** Procesamiento automático de ideas sin invocación manual.
- **Complejidad técnica:** Media-alta. Proceso en segundo plano, polling/eventos de FS, idempotencia.
- **Valor práctico:** Medio. La automatización es cómoda pero introduce "magia".
- **Riesgos:** Comportamiento implícito, procesos colgados, difícil de razonar y testear.
- **Motivo:** ❌ **Descartar.** Contradice "ejecutable desde consola" simple y atómica.

---

## Variante D — Rellenador de plantillas fijas

- **Descripción corta:** La IA solo completa los huecos de una plantilla rígida predefinida.
- **Usuario objetivo:** Quien quiere salidas 100% predecibles.
- **Problema que resuelve:** Consistencia de formato de salida.
- **Complejidad técnica:** Baja.
- **Valor práctico:** Medio-bajo. Predecible pero poco flexible; no "idea" realmente.
- **Riesgos:** Rigidez; la idea desordenada no siempre encaja en huecos fijos.
- **Motivo:** ❌ **Descartar como producto, ✅ adoptar como técnica.** Los prompts de la variante A ya imponen una estructura de salida, capturando lo mejor de D sin su rigidez.

---

## Variante E — Pipeline encadenado automático

- **Descripción corta:** Un solo comando ejecuta `ideate → mvp → brief` en cadena.
- **Usuario objetivo:** Quien quiere todo de una sola pasada.
- **Problema que resuelve:** Comodidad de un flujo completo en un comando.
- **Complejidad técnica:** Media. Encadenar salidas como entradas, manejar fallos parciales.
- **Valor práctico:** Medio. Cómodo, pero acopla fases que conviene practicar por separado.
- **Riesgos:** Acoplamiento; un fallo temprano arruina toda la cadena; menos control pedagógico.
- **Motivo:** ❌ **Descartar (por ahora).** El objetivo es *practicar ideación por fases*; encadenar las funde. Mejora futura opcional.

---

## Conclusión

La **Variante A** se selecciona para implementar. Es la más simple, cumple todas las restricciones, mantiene cada fase de ideación separada y verificable, e incorpora las mejores partes de D (estructura en prompts). B y E quedan como mejoras futuras.
