import type { Priority } from '../../core/models/friction.model';
import type { InitiativeComplexity, InitiativeStatus } from '../../core/models/initiative.model';

export type Option<T extends string> = {
  label: string;
  value: T;
};

export const initiativeComplexityOptions: Option<InitiativeComplexity>[] = [
  { label: 'Baja', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' }
];

export const initiativeStatusOptions: Option<InitiativeStatus>[] = [
  { label: 'Propuesta', value: 'proposed' },
  { label: 'Planificada', value: 'planned' },
  { label: 'En progreso', value: 'in_progress' },
  { label: 'Completada', value: 'completed' },
  { label: 'Cancelada', value: 'cancelled' }
];

export const initiativePriorityOptions: Option<Priority>[] = [
  { label: 'Baja', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' }
];
