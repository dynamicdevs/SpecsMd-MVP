import type {
  AutomationPotential,
  FrictionCategory,
  FrictionStatus,
  Frequency,
  PainLevel,
  Priority
} from '../../core/models/friction.model';

export type Option<T extends string> = {
  label: string;
  value: T;
};

export const frequencyOptions: Option<Frequency>[] = [
  { label: 'Diaria', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensual', value: 'monthly' },
  { label: 'Ocasional', value: 'occasional' }
];

export const painLevelOptions: Option<PainLevel>[] = [
  { label: 'Baja', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' }
];

export const statusOptions: Option<FrictionStatus>[] = [
  { label: 'Abierta', value: 'open' },
  { label: 'En revision', value: 'in_review' },
  { label: 'Resuelta', value: 'resolved' },
  { label: 'Archivada', value: 'archived' }
];

export const categoryOptions: Option<FrictionCategory>[] = [
  { label: 'Trabajo manual repetitivo', value: 'manual_repetitive_work' },
  { label: 'Espera o dependencia de terceros', value: 'third_party_waiting' },
  { label: 'Duplicacion de datos', value: 'data_duplication' },
  { label: 'Reuniones innecesarias', value: 'unnecessary_meetings' },
  { label: 'Aprobaciones manuales', value: 'manual_approvals' },
  { label: 'Falta de integracion entre sistemas', value: 'missing_system_integration' },
  { label: 'Busqueda excesiva de informacion', value: 'excessive_information_search' },
  { label: 'Errores humanos recurrentes', value: 'recurring_human_errors' },
  { label: 'Falta de trazabilidad', value: 'lack_of_traceability' },
  { label: 'Sin clasificar', value: 'unclassified' }
];

export const automationPotentialOptions: Option<AutomationPotential>[] = [
  { label: 'Bajo', value: 'low' },
  { label: 'Medio', value: 'medium' },
  { label: 'Alto', value: 'high' }
];

export const priorityOptions: Option<Priority>[] = [
  { label: 'Baja', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' }
];
