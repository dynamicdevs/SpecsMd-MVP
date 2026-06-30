"""Configuración de pytest: asegura que la raíz del proyecto esté en sys.path.

Permite importar `src.*` al ejecutar `pytest` desde la carpeta `localnote-ai/`.
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
