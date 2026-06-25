import { z } from "zod";
import {
  automationPotentials,
  frictionCategories,
  frictionStatuses,
  frequencies,
  painLevels,
  priorities
} from "../entities/friction.js";

export const createFrictionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  area: z.string().min(1),
  category: z.enum(frictionCategories).default("unclassified"),
  frequency: z.enum(frequencies),
  timeLostMinutes: z.number().int().nonnegative(),
  peopleAffected: z.number().int().positive(),
  painLevel: z.enum(painLevels),
  automationPotential: z.enum(automationPotentials).default("medium"),
  monthlyHoursLost: z.number().nonnegative().default(0),
  estimatedMonthlyCost: z.number().nonnegative().default(0),
  priority: z.enum(priorities).default("medium"),
  status: z.enum(frictionStatuses).default("open")
});

export const updateFrictionSchema = createFrictionSchema.partial();

export const frictionListItemSchema = createFrictionSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const frictionDetailSchema = frictionListItemSchema.extend({
  initiativesCount: z.number().int().nonnegative().optional(),
  commentsCount: z.number().int().nonnegative().optional()
});

export type CreateFrictionDto = z.infer<typeof createFrictionSchema>;
export type UpdateFrictionDto = z.infer<typeof updateFrictionSchema>;
export type FrictionListItemDto = z.infer<typeof frictionListItemSchema>;
export type FrictionDetailDto = z.infer<typeof frictionDetailSchema>;
