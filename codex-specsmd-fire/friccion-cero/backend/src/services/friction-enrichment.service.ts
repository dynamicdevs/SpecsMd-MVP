import { env } from "../config/env.js";
import type { CreateFrictionDto } from "../dtos/friction.dto.js";
import {
  calculateEstimatedMonthlyCost,
  calculateMonthlyHoursLost
} from "./friction-impact.service.js";
import {
  classifyFrictionCategory,
  suggestAutomationPotential
} from "./friction-classification.service.js";
import { suggestPriority } from "./friction-priority.service.js";

export type FrictionEnrichmentInput = Omit<
  CreateFrictionDto,
  "category" | "automationPotential" | "monthlyHoursLost" | "estimatedMonthlyCost" | "priority"
> &
  Partial<Pick<CreateFrictionDto, "category" | "automationPotential" | "monthlyHoursLost" | "estimatedMonthlyCost" | "priority">>;

export function enrichFrictionInput(input: FrictionEnrichmentInput, hourlyCost = env.DEFAULT_HOURLY_COST): CreateFrictionDto {
  const category = input.category === undefined || input.category === "unclassified"
    ? classifyFrictionCategory(input)
    : input.category;
  const automationPotential = input.automationPotential ?? suggestAutomationPotential(category);
  const monthlyHoursLost = input.monthlyHoursLost ?? calculateMonthlyHoursLost(input);
  const estimatedMonthlyCost = input.estimatedMonthlyCost ?? calculateEstimatedMonthlyCost(monthlyHoursLost, hourlyCost);
  const priority = input.priority ?? suggestPriority({
    monthlyHoursLost,
    estimatedMonthlyCost,
    painLevel: input.painLevel,
    automationPotential
  });

  return {
    ...input,
    category,
    automationPotential,
    monthlyHoursLost,
    estimatedMonthlyCost,
    priority
  };
}
