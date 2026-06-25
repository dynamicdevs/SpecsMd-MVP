export interface Friction {
  id: number;
  title: string;
  description: string | null;
  area: string | null;
  category: string;
  frequency: number;
  time_lost_minutes: number;
  people_affected: number;
  pain_level: number;
  automation_potential: string;
  monthly_hours_lost: number;
  estimated_monthly_cost: number;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FrictionCreate {
  title: string;
  description?: string;
  area?: string;
  category: string;
  frequency: number;
  time_lost_minutes: number;
  people_affected: number;
  pain_level: number;
}

export interface Initiative {
  id: number;
  friction_id: number;
  title: string;
  proposed_solution: string | null;
  expected_reduction_percent: number | null;
  complexity: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InitiativeCreate {
  friction_id: number;
  title: string;
  proposed_solution?: string;
  expected_reduction_percent?: number;
  complexity?: string;
  priority?: string;
}

export interface FrictionComment {
  id: number;
  friction_id: number;
  comment: string;
  created_at: string;
}

export interface DashboardData {
  total_frictions: number;
  total_monthly_hours_lost: number;
  total_estimated_monthly_cost: number;
  by_category: { category: string; count: number }[];
  by_priority: { priority: string; count: number }[];
  top_costly_frictions: {
    id: number;
    title: string;
    category: string;
    monthly_hours_lost: number;
    estimated_monthly_cost: number;
    priority: string;
  }[];
  initiatives_by_status: { status: string; count: number }[];
}

export const CATEGORIES = [
  { value: 'repetitive_work', label: 'Trabajo manual repetitivo' },
  { value: 'waiting_dependency', label: 'Espera o dependencia de terceros' },
  { value: 'data_duplication', label: 'Duplicación de datos' },
  { value: 'unnecessary_meetings', label: 'Reuniones innecesarias' },
  { value: 'manual_approvals', label: 'Aprobaciones manuales' },
  { value: 'lack_of_integration', label: 'Falta de integración entre sistemas' },
  { value: 'excessive_search', label: 'Búsqueda excesiva de información' },
  { value: 'human_errors', label: 'Errores humanos recurrentes' },
  { value: 'lack_of_traceability', label: 'Falta de trazabilidad' },
];
