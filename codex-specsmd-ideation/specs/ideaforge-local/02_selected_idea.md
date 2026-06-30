# IdeaForge Local - Selected Idea

## Variante elegida

Un asistente local de ideacion que toma una idea desordenada y genera:

1. Resumen claro de la idea.
2. Problema principal.
3. Usuario objetivo.
4. Propuesta de valor.
5. Funcionalidades candidatas.
6. Riesgos.
7. Version MVP recomendada.
8. Proximos pasos.
9. Un mini brief tecnico.

## Justificacion

Esta idea es la mas adecuada porque ataca el momento exacto en que una persona tiene energia creativa pero todavia no tiene claridad suficiente para implementar. La salida no intenta ser una especificacion completa ni una arquitectura definitiva; funciona como una primera conversion de caos a estructura.

Tambien es una buena candidata porque se puede construir con una CLI simple, prompts separados, lectura/escritura local y una sola dependencia de IA: Ollama. No requiere interfaz web, base de datos, autenticacion, red externa ni infraestructura adicional.

## Por que es suficientemente pequena

- Solo hay cuatro comandos principales: `ideate`, `compare`, `mvp` y `brief`.
- Cada comando construye un prompt y envia texto a Ollama.
- La entrada viene desde `--text` o `--file`.
- La salida se imprime en consola y opcionalmente se guarda en un archivo local.
- Los modulos internos son pequenos y tienen responsabilidades claras.

## Por que sirve para practicar ideacion con IA

El proyecto obliga a separar fases:

- Primero se expande la idea.
- Luego se comparan oportunidades.
- Despues se selecciona un alcance.
- Finalmente se baja a requisitos, diseno y tareas.

Ademas, la propia aplicacion resultante permite repetir ese flujo con nuevas ideas. Por eso funciona como producto y como laboratorio de metodologia.

## Fuera del MVP

- Interfaz grafica o web.
- Gestion de historial de sesiones.
- Base de datos local o remota.
- Login, usuarios o sincronizacion.
- Integraciones con servicios externos.
- Ejecucion automatica de codigo generado por IA.
- Plantillas editables desde UI.
- Busqueda en archivos generados.
- Evaluaciones cuantitativas complejas.
