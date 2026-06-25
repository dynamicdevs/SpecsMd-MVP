"""Enums de dominio (valores en español según el spec de Fricción Cero)."""
from enum import Enum


class Category(str, Enum):
    TRABAJO_MANUAL = "Trabajo manual repetitivo"
    ESPERA_TERCEROS = "Espera o dependencia de terceros"
    DUPLICACION_DATOS = "Duplicación de datos"
    REUNIONES = "Reuniones innecesarias"
    APROBACIONES = "Aprobaciones manuales"
    FALTA_INTEGRACION = "Falta de integración"
    BUSQUEDA_INFO = "Búsqueda excesiva de información"
    ERROR_HUMANO = "Error humano recurrente"
    FALTA_TRAZABILIDAD = "Falta de trazabilidad"
    OTRO = "Otro"


class FrictionStatus(str, Enum):
    DETECTADA = "Detectada"
    ANALIZADA = "Analizada"
    PRIORIZADA = "Priorizada"
    EN_SOLUCION = "En solución"
    RESUELTA = "Resuelta"
    DESCARTADA = "Descartada"


class Priority(str, Enum):
    BAJA = "Baja"
    MEDIA = "Media"
    ALTA = "Alta"
    CRITICA = "Crítica"


class AutomationPotential(str, Enum):
    BAJO = "Bajo"
    MEDIO = "Medio"
    ALTO = "Alto"


class Complexity(str, Enum):
    BAJA = "Baja"
    MEDIA = "Media"
    ALTA = "Alta"


class InitiativeStatus(str, Enum):
    PROPUESTA = "Propuesta"
    EN_EVALUACION = "En evaluación"
    EN_DESARROLLO = "En desarrollo"
    IMPLEMENTADA = "Implementada"
    DESCARTADA = "Descartada"
