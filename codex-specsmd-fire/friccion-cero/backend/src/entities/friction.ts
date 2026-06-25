export const frictionCategories = [
  "manual_repetitive_work",
  "third_party_waiting",
  "data_duplication",
  "unnecessary_meetings",
  "manual_approvals",
  "missing_system_integration",
  "excessive_information_search",
  "recurring_human_errors",
  "lack_of_traceability",
  "unclassified"
] as const;

export const frequencies = ["daily", "weekly", "monthly", "occasional"] as const;
export const painLevels = ["low", "medium", "high"] as const;
export const automationPotentials = ["low", "medium", "high"] as const;
export const priorities = ["low", "medium", "high"] as const;
export const frictionStatuses = ["open", "in_review", "resolved", "archived"] as const;

export type FrictionCategory = (typeof frictionCategories)[number];
export type Frequency = (typeof frequencies)[number];
export type PainLevel = (typeof painLevels)[number];
export type AutomationPotential = (typeof automationPotentials)[number];
export type Priority = (typeof priorities)[number];
export type FrictionStatus = (typeof frictionStatuses)[number];

export interface Friction {
  id: string;
  title: string;
  description: string;
  area: string;
  category: FrictionCategory;
  frequency: Frequency;
  timeLostMinutes: number;
  peopleAffected: number;
  painLevel: PainLevel;
  automationPotential: AutomationPotential;
  monthlyHoursLost: number;
  estimatedMonthlyCost: number;
  priority: Priority;
  status: FrictionStatus;
  createdAt: Date;
  updatedAt: Date;
}
