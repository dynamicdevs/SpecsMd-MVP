# Design — LocalNote AI

## Arquitectura

Arquitectura simple de aplicación CLI con módulos separados por responsabilidad:

```
┌─────────────────────────────────────────────┐
│                  app.py                       │
│            (CLI + argparse)                   │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┼──────────────────┐
    │          │                  │
    ▼          ▼                  ▼
┌────────┐ ┌──────────┐ ┌──────────────┐
│ config │ │ prompts  │ │ file_loader  │
└────────┘ └──────────┘ └──────────────┘
               │
               ▼
         ┌───────────┐
         │ ai_client │
         └─────┬─────┘
               │
               ▼
         ┌───────────┐
         │  Ollama   │
         │ (local)   │
         └───────────┘
```

---

## Flujo de Datos

1. Usuario ejecuta `python app.py <comando> --text "..." [--question "..."]`
2. `app.py` parsea argumentos con `argparse`
3. Si `--file`, `file_loader.py` lee el contenido del archivo
4. `prompts.py` genera el prompt adecuado según el comando
5. `ai_client.py` envía el prompt a Ollama via la librería oficial
6. Se imprime la respuesta en consola
7. Si hay error, se muestra mensaje amigable sin stack trace

---

## Módulos Internos

| Módulo | Archivo | Responsabilidad |
|--------|---------|-----------------|
| CLI | `app.py` | Entry point, parseo de argumentos, orquestación |
| Config | `src/config.py` | Carga modelo desde `.env` o usa default |
| AI Client | `src/ai_client.py` | Encapsula llamada a Ollama |
| Prompts | `src/prompts.py` | Genera prompts según modo (summarize, tasks, etc.) |
| File Loader | `src/file_loader.py` | Lee archivos de texto locales con UTF-8 |

---

## Conexión con Ollama

- Se usa la librería oficial `ollama` para Python
- La llamada base es:
  ```python
  from ollama import chat
  response = chat(
      model=MODEL,
      messages=[{'role': 'user', 'content': prompt}],
  )
  return response.message.content
  ```
- El modelo se lee de la variable `OLLAMA_MODEL` en `.env`
- Default: `minimax-m3:cloud`

---

## Manejo de Errores

| Error | Comportamiento |
|-------|----------------|
| Ollama no disponible | Mensaje: "Error: No se pudo conectar con Ollama. Asegúrate de que esté corriendo." |
| Archivo no encontrado | Mensaje: "Error: No se encontró el archivo: {path}" |
| Archivo no legible | Mensaje: "Error: No se pudo leer el archivo: {path}" |
| Sin --text ni --file | Mensaje: "Error: Debes proporcionar --text o --file" |
| ask sin --question | Mensaje: "Error: El comando 'ask' requiere --question" |
| Error inesperado de Ollama | Mensaje: "Error al procesar con IA: {detalle}" |

En todos los casos se usa `sys.exit(1)` y NO se muestran stack traces.

---

## Decisiones Técnicas

| Decisión | Razón |
|----------|-------|
| argparse sobre click/typer | Viene con Python, sin dependencias extra |
| python-dotenv | Patrón estándar para configuración por entorno |
| Módulos en `src/` | Separación clara, testeable |
| Sin clases | La app es simple, funciones son suficientes |
| UTF-8 explícito en file_loader | Compatibilidad cross-platform |
| sys.exit(1) en errores | Código de salida correcto para scripts |
