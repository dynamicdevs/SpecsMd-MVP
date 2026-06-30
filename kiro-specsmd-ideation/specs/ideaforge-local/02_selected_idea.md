# 02 · Selected Idea — IdeaForge Local

## Variante elegida

**Asistente local de ideación (Variante A · CLI por modos).**

Toma una idea desordenada y, según el modo, genera una salida estructurada en Markdown. El asistente cubre las siguientes piezas de ideación:

1. **Resumen claro de la idea.**
2. **Problema principal.**
3. **Usuario objetivo.**
4. **Propuesta de valor.**
5. **Funcionalidades candidatas.**
6. **Riesgos.**
7. **Versión MVP recomendada.**
8. **Próximos pasos.**
9. **Mini brief técnico.**

Estas piezas se reparten en cuatro modos:

| Modo      | Qué hace                                                        |
|-----------|-----------------------------------------------------------------|
| `ideate`  | Idea cruda → propuesta clara (resumen, problema, usuario, valor, funcionalidades, riesgos, MVP, próximos pasos). |
| `compare` | Varias ideas → criterios, comparación y recomendación.          |
| `mvp`     | Idea grande → MVP mínimo viable y lo que queda fuera.           |
| `brief`   | Idea inicial → mini brief técnico para arrancar.                |

## Justificación

### Por qué es la idea más adecuada
- Cumple **todas** las restricciones: 100% local, solo Ollama, sin web frameworks, sin DB, sin Docker, sin nube.
- Mapea directamente a las fases de una metodología de ideación, lo que la hace ideal como **laboratorio de práctica**.
- Salida en Markdown: legible, versionable y reutilizable como insumo del siguiente paso.

### Por qué es suficientemente pequeña
- Un único punto de entrada (`app.py`) con argparse y 4 subcomandos.
- Módulos pequeños y de responsabilidad única (`config`, `ai_client`, `prompts`, `file_loader`, `output_writer`).
- Sin estado persistente, sin sesiones, sin procesos en segundo plano. Cada comando es atómico.

### Por qué sirve para practicar ideación con IA
- Cada modo fuerza a pensar una dimensión distinta de la idea (estructura, comparación, recorte, especificación).
- Separar los modos evita el atajo de "todo de una" y obliga a recorrer las fases.
- Los prompts viven separados del código, por lo que iterar sobre la *calidad de la ideación* es trivial.

## Qué queda fuera del MVP
- REPL conversacional / refinamiento por turnos (Variante B).
- Pipeline automático encadenado `ideate→mvp→brief` (Variante E).
- Watcher de carpetas (Variante C).
- Historial, memoria entre ejecuciones o base de datos.
- Cualquier UI gráfica o web.
- Integraciones externas de cualquier tipo.

Ver requisitos detallados en [03_requirements.md](03_requirements.md).
