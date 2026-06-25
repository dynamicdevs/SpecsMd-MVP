import type { AutomationPotential, PainLevel, Priority } from "../entities/friction.js";

const painScore: Record<PainLevel, number> = {
  low: 0,
  medium: 1,
  high: 2
};

const automationScore: Record<AutomationPotential, number> = {
  low: 0,
  medium: 1,
  high: 2
};

export interface PriorityInput {
  monthlyHoursLost: number;
  estimatedMonthlyCost: number;
  painLevel: PainLevel;
  automationPotential: AutomationPotential;
}

export function suggestPriority(input: PriorityInput): Priority {
  const hoursScore = input.monthlyHoursLost >= 40 ? 2 : input.monthlyHoursLost >= 10 ? 1 : 0;
  const costScore = input.estimatedMonthlyCost >= 2000 ? 2 : input.estimatedMonthlyCost >= 500 ? 1 : 0;
  const score = hoursScore + costScore + painScore[input.painLevel] + automationScore[input.automationPotential];

  if ((input.painLevel === "high" && (hoursScore === 2 || costScore === 2)) || score >= 6) {
    return "high";
  }

  if (score >= 3) {
    return "medium";
  }

  return "low";
}
