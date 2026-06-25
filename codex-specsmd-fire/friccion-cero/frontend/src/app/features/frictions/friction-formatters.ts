import type {
  AutomationPotential,
  FrictionCategory,
  FrictionStatus,
  Frequency,
  PainLevel,
  Priority
} from '../../core/models/friction.model';
import {
  automationPotentialOptions,
  categoryOptions,
  frequencyOptions,
  painLevelOptions,
  priorityOptions,
  statusOptions
} from './friction-options';

export type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

export function categoryLabel(value: FrictionCategory): string {
  return lookup(categoryOptions, value);
}

export function frequencyLabel(value: Frequency): string {
  return lookup(frequencyOptions, value);
}

export function painLevelLabel(value: PainLevel): string {
  return lookup(painLevelOptions, value);
}

export function statusLabel(value: FrictionStatus): string {
  return lookup(statusOptions, value);
}

export function priorityLabel(value: Priority): string {
  return lookup(priorityOptions, value);
}

export function automationPotentialLabel(value: AutomationPotential): string {
  return lookup(automationPotentialOptions, value);
}

export function prioritySeverity(value: Priority): TagSeverity {
  const severities: Record<Priority, TagSeverity> = {
    low: 'secondary',
    medium: 'warn',
    high: 'danger'
  };

  return severities[value];
}

export function statusSeverity(value: FrictionStatus): TagSeverity {
  const severities: Record<FrictionStatus, TagSeverity> = {
    open: 'info',
    in_review: 'warn',
    resolved: 'success',
    archived: 'secondary'
  };

  return severities[value];
}

export function formatHours(value: number): string {
  return `${value.toLocaleString('es-CL', { maximumFractionDigits: 2 })} h`;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('es-CL', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency'
  });
}

function lookup<T extends string>(options: Array<{ label: string; value: T }>, value: T): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
