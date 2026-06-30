# LocalNote AI

Aplicación CLI en Python que procesa texto con IA local usando Ollama. Permite resumir, extraer tareas, limpiar notas, profesionalizar mensajes y hacer preguntas libres sobre cualquier texto.

---

## Requisitos

- Python 3.11 o superior
- Ollama instalado y corriendo localmente
- Modelo descargado: `minimax-m3:cloud`

---

## Instalación

```bash
cd localnote-ai

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (macOS/Linux)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

---

## Configuración

Copia el archivo de ejemplo y ajusta si necesitas otro modelo:

```bash
copy .env.example .env
```

Contenido de `.env`:

```env
OLLAMA_MODEL=minimax-m3:cloud
```

Para cambiar el modelo, simplemente edita esa variable.

---

## Cómo ejecutar Ollama

1. Instala Ollama desde https://ollama.com
2. Descarga el modelo:
   ```bash
   ollama pull minimax-m3:cloud
   ```
3. Ollama se ejecuta automáticamente como servicio. Si necesitas iniciarlo manualmente:
   ```bash
   ollama serve
   ```

---

## Comandos Disponibles

### Resumir texto

```bash
python app.py summarize --text "Tu texto largo aquí..."
python app.py summarize --file ./examples/nota.txt
```

### Extraer tareas pendientes

```bash
python app.py tasks --text "Texto con pendientes y compromisos..."
python app.py tasks --file ./examples/nota.txt
```

### Limpiar y ordenar notas

```bash
python app.py clean --text "Notas desordenadas, ideas sueltas..."
python app.py clean --file ./examples/nota.txt
```

### Profesionalizar un mensaje

```bash
python app.py professional --text "oye necesito que me mandes eso antes del viernes porfa"
```

### Hacer una pregunta sobre el texto

```bash
python app.py ask --text "Contexto sobre un proyecto..." --question "¿Qué debo priorizar?"
python app.py ask --file ./examples/nota.txt --question "¿Cuáles son las tareas más urgentes?"
```

---

## Cómo correr tests

```bash
pytest tests/ -v
```

---

## Estructura del Proyecto

```
localnote-ai/
├── app.py                 # Entry point CLI
├── requirements.txt       # Dependencias
├── README.md              # Este archivo
├── .env.example           # Configuración de ejemplo
├── examples/
│   └── nota.txt           # Texto de ejemplo
├── src/
│   ├── __init__.py
│   ├── ai_client.py       # Comunicación con Ollama
│   ├── config.py          # Carga de configuración
│   ├── prompts.py         # Generación de prompts por modo
│   └── file_loader.py     # Lectura de archivos locales
└── tests/
    ├── test_file_loader.py
    └── test_prompts.py
```

---

## Metodología

Proyecto construido con **Specs.md SIMPLE**:

1. **Requirements** → Definición de propósito, usuarios, funcionalidades y restricciones
2. **Design** → Arquitectura, flujo de datos, módulos y decisiones técnicas
3. **Tasks** → Lista de tareas verificables desde setup hasta pruebas

Los documentos están en `specs/localnote-ai/`.

---

## Limitaciones

- Requiere Ollama corriendo localmente
- La velocidad de respuesta depende del modelo y hardware
- Solo procesa texto plano (no PDF, DOCX, etc.)
- No tiene historial de conversaciones
- No tiene interfaz gráfica

---

## Construido por

**Mauricio De Juan** — mdejuan@dynamicdevs.io

Desarrollado con Kiro IDE usando Specs.md SIMPLE.
