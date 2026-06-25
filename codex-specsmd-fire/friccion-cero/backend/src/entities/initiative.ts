import type { Priority } from "./friction.js";

export const initiativeComplexities = ["low", "medium", "high"] as const;
export const initiativeStatuses = ["proposed", "planned", "in_progress", "completed", "cancelled"] as const;

export type InitiativeComplexity = (typeof initiativeComplexities)[number];
export type InitiativeStatus = (typeof initiativeStatuses)[number];

export interface Initiative {
  id: string;
  frictionId: string;
  title: string;
  proposedSolution: string;
  expectedReductionPercent: number;
  complexity: InitiativeComplexity;
  priority: Priority;
  status: InitiativeStatus;
  createdAt: Date;
  updatedAt: Date;
}
