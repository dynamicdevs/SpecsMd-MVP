import type { FrictionCategory, FrictionStatus, Priority } from './friction.model';
import type { InitiativeStatus } from './initiative.model';

export interface DashboardSummary {
  totals: {
    frictions: number;
    monthlyHoursLost: number;
    estimatedMonthlyCost: number;
    initiatives: number;
  };
  initiativeCountsByStatus: Partial<Record<InitiativeStatus, number>>;
  frictionCountsByCategory: Partial<Record<FrictionCategory, number>>;
  frictionCountsByPriority: Partial<Record<Priority, number>>;
  frictionCountsByStatus: Partial<Record<FrictionStatus, number>>;
  mostCostlyFrictions: Array<{
    id: string;
    title: string;
    area: string;
    category: FrictionCategory;
    monthlyHoursLost: number;
    estimatedMonthlyCost: number;
    priority: Priority;
    status: FrictionStatus;
  }>;
}
