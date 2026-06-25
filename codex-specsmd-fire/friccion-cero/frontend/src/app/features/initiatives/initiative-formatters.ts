import type { Priority } from '../../core/models/friction.model';
import type { InitiativeComplexity, InitiativeStatus } from '../../core/models/initiative.model';
import {
  initiativeComplexityOptions,
  initiativePriorityOptions,
  initiativeStatusOptions
} from './initiative-options';

export type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

export function complexityLabel(value: InitiativeComplexity): string {
  return lookup(initiativeComplexityOptions, value);
}

export function initiativeStatusLabel(value: InitiativeStatus): string {
  return lookup(initiativeStatusOptions, value);
}

export function initiativePriorityLabel(value: Priority): string {
  return lookup(initiativePriorityOptions, value);
}

export function initiativeStatusSeverity(value: InitiativeStatus): TagSeverity {
  const severities: Record<InitiativeStatus, TagSeverity> = {
    proposed: 'info',
    planned: 'warn',
    in_progress: 'contrast',
    completed: 'success',
    cancelled: 'secondary'
  };

  return severities[value];
}

export function initiativePrioritySeverity(value: Priority): TagSeverity {
  const severities: Record<Priority, TagSeverity> = {
    low: 'secondary',
    medium: 'warn',
    high: 'danger'
  };

  return severities[value];
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString('es-CL', { maximumFractionDigits: 0 })}%`;
}

function lookup<T extends string>(options: Array<{ label: string; value: T }>, value: T): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
