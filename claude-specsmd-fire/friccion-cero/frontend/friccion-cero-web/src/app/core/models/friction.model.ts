import {
  AutomationPotential,
  Category,
  FrictionStatus,
  Priority,
} from './enums';

export interface Friction {
  id: number;
  title: string;
  description: string;
  area: string;
  category: Category;
  frequency: number;
  timeLostMinutes: number;
  peopleAffected: number;
  painLevel: number;
  automationPotential: AutomationPotential;
  monthlyHoursLost: number;
  estimatedMonthlyCost: number;
  priority: Priority;
  status: FrictionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FrictionCreate {
  title: string;
  description?: string;
  area?: string;
  category?: Category | null;
  frequency: number;
  timeLostMinutes: number;
  peopleAffected: number;
  painLevel: number;
  automationPotential: AutomationPotential;
  status?: FrictionStatus;
}

export type FrictionUpdate = Partial<FrictionCreate>;
