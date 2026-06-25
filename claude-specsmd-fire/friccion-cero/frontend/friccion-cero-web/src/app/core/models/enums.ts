// Valores de enums alineados con el backend (en español).

export const CATEGORIES = [
  'Trabajo manual repetitivo',
  'Espera o dependencia de terceros',
  'Duplicación de datos',
  'Reuniones innecesarias',
  'Aprobaciones manuales',
  'Falta de integración',
  'Búsqueda excesiva de información',
  'Error humano recurrente',
  'Falta de trazabilidad',
  'Otro',
] as const;

export const FRICTION_STATUSES = [
  'Detectada',
  'Analizada',
  'Priorizada',
  'En solución',
  'Resuelta',
  'Descartada',
] as const;

export const PRIORITIES = ['Baja', 'Media', 'Alta', 'Crítica'] as const;

export const AUTOMATION_POTENTIALS = ['Bajo', 'Medio', 'Alto'] as const;

export const COMPLEXITIES = ['Baja', 'Media', 'Alta'] as const;

export const INITIATIVE_STATUSES = [
  'Propuesta',
  'En evaluación',
  'En desarrollo',
  'Implementada',
  'Descartada',
] as const;

export type Category = (typeof CATEGORIES)[number];
export type FrictionStatus = (typeof FRICTION_STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type AutomationPotential = (typeof AUTOMATION_POTENTIALS)[number];
export type Complexity = (typeof COMPLEXITIES)[number];
export type InitiativeStatus = (typeof INITIATIVE_STATUSES)[number];

// Helper para construir options de p-dropdown.
export function toOptions<T extends string>(values: readonly T[]): { label: T; value: T }[] {
  return values.map((v) => ({ label: v, value: v }));
}

// Color de severidad para p-tag según prioridad.
export function prioritySeverity(p: Priority): 'success' | 'info' | 'warning' | 'danger' {
  switch (p) {
    case 'Crítica':
      return 'danger';
    case 'Alta':
      return 'warning';
    case 'Media':
      return 'info';
    default:
      return 'success';
  }
}
