# IdeaForge Local - Opportunities

## Variante 1: Clarificador de ideas

- **Descripcion corta:** Convierte una idea desordenada en una propuesta clara con resumen, problema, usuario, valor, funcionalidades, riesgos y pasos.
- **Usuario objetivo:** Desarrolladores, estudiantes y makers con ideas iniciales.
- **Problema que resuelve:** La idea existe, pero no esta lista para convertirse en proyecto.
- **Complejidad tecnica:** Baja.
- **Valor practico:** Alto, porque entrega una salida reutilizable inmediatamente.
- **Riesgos:** Puede producir respuestas genericas si el prompt no guia bien el formato.
- **Motivo para elegirla o descartarla:** Elegible por ser simple, local y directamente alineada con el objetivo del proyecto.

## Variante 2: Comparador local de ideas

- **Descripcion corta:** Recibe varias ideas y recomienda cual conviene explorar primero.
- **Usuario objetivo:** Personas con muchas ideas y poco tiempo para priorizar.
- **Problema que resuelve:** Dificultad para elegir una idea viable.
- **Complejidad tecnica:** Baja-media.
- **Valor practico:** Alto cuando hay varias opciones.
- **Riesgos:** La comparacion depende de la calidad del texto de entrada.
- **Motivo para elegirla o descartarla:** Buena como modo complementario, pero no deberia ser el nucleo inicial.

## Variante 3: Recortador de MVP

- **Descripcion corta:** Toma una idea grande y propone una primera version pequena.
- **Usuario objetivo:** Builders que tienden a sobreplanificar.
- **Problema que resuelve:** Exceso de alcance y dificultad para empezar.
- **Complejidad tecnica:** Baja.
- **Valor practico:** Alto para planificacion temprana.
- **Riesgos:** Puede recortar demasiado si no entiende la propuesta central.
- **Motivo para elegirla o descartarla:** Conviene incluirla como comando `mvp`, no como unica experiencia.

## Variante 4: Generador de brief tecnico

- **Descripcion corta:** Produce un brief tecnico inicial con objetivo, usuario, flujo, modulos y restricciones.
- **Usuario objetivo:** Desarrolladores que necesitan pasar de idea a implementacion.
- **Problema que resuelve:** Falta de puente entre ideacion y diseno tecnico.
- **Complejidad tecnica:** Baja.
- **Valor practico:** Alto para preparar un README, issue o spec.
- **Riesgos:** Si se vuelve demasiado detallado, puede inventar arquitectura innecesaria.
- **Motivo para elegirla o descartarla:** Conviene incluirla como comando `brief` con salida acotada.

## Variante 5: Diario local de ideas

- **Descripcion corta:** Guarda ideas y respuestas en carpetas locales por fecha.
- **Usuario objetivo:** Personas que idean constantemente y quieren historial.
- **Problema que resuelve:** Perdida de ideas y falta de continuidad.
- **Complejidad tecnica:** Media.
- **Valor practico:** Medio.
- **Riesgos:** Empieza a parecer una base de conocimiento y puede requerir indices, busqueda o persistencia mas compleja.
- **Motivo para elegirla o descartarla:** Se descarta del MVP para evitar sobreingenieria.

## Variante 6: Laboratorio de prompts

- **Descripcion corta:** Permite editar y probar prompts locales para distintos modos de ideacion.
- **Usuario objetivo:** Personas aprendiendo prompt engineering local.
- **Problema que resuelve:** Dificultad para experimentar con formatos de salida.
- **Complejidad tecnica:** Media.
- **Valor practico:** Medio-alto para aprendizaje.
- **Riesgos:** Puede desviar el foco hacia una herramienta de experimentacion y no hacia ideacion de proyectos.
- **Motivo para elegirla o descartarla:** Se descarta como producto principal, pero se conserva la separacion de prompts como decision de diseno.

## Variante recomendada

La mejor oportunidad es combinar de forma pequena las variantes 1, 2, 3 y 4 en una CLI con cuatro modos: `ideate`, `compare`, `mvp` y `brief`. El nucleo sigue siendo el clarificador de ideas, con modos especificos para priorizar, reducir alcance y generar un brief tecnico inicial.
