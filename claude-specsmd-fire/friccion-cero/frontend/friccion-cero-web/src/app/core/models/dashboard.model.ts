import { Friction } from './friction.model';

export interface CountItem {
  label: string;
  count: number;
}

export interface InitiativeStatusItem {
  status: string;
  count: number;
}

export interface DashboardSummary {
  totalFrictions: number;
  totalMonthlyHoursLost: number;
  totalEstimatedMonthlyCost: number;
  frictionsByCategory: CountItem[];
  frictionsByPriority: CountItem[];
  top5CostlyFrictions: Friction[];
  initiativesByStatus: InitiativeStatusItem[];
}
