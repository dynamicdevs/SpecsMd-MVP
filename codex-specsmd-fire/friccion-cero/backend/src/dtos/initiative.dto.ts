import { z } from "zod";
import { priorities } from "../entities/friction.js";
import { initiativeComplexities, initiativeStatuses } from "../entities/initiative.js";

export const createInitiativeSchema = z.object({
  frictionId: z.string().min(1),
  title: z.string().min(1),
  proposedSolution: z.string().min(1),
  expectedReductionPercent: z.number().int().min(0).max(100),
  complexity: z.enum(initiativeComplexities),
  priority: z.enum(priorities).default("medium"),
  status: z.enum(initiativeStatuses).default("proposed")
});

export const updateInitiativeSchema = createInitiativeSchema.omit({ frictionId: true }).partial();

export const initiativeListItemSchema = createInitiativeSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const initiativeDetailSchema = initiativeListItemSchema.extend({
  frictionTitle: z.string().optional()
});

export type CreateInitiativeDto = z.infer<typeof createInitiativeSchema>;
export type UpdateInitiativeDto = z.infer<typeof updateInitiativeSchema>;
export type InitiativeListItemDto = z.infer<typeof initiativeListItemSchema>;
export type InitiativeDetailDto = z.infer<typeof initiativeDetailSchema>;
