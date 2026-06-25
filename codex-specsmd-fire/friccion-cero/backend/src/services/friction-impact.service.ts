import { env } from "../config/env.js";
import type { Frequency } from "../entities/friction.js";

export const monthlyFrequencyMultipliers: Record<Frequency, number> = {
  daily: 22,
  weekly: 4,
  monthly: 1,
  occasional: 0.5
};

export interface FrictionImpactInput {
  timeLostMinutes: number;
  frequency: Frequency;
  peopleAffected: number;
}

export function calculateMonthlyHoursLost(input: FrictionImpactInput): number {
  const monthlyFrequency = monthlyFrequencyMultipliers[input.frequency];
  const hours = (input.timeLostMinutes * monthlyFrequency * input.peopleAffected) / 60;

  return roundToTwoDecimals(hours);
}

export function calculateEstimatedMonthlyCost(monthlyHoursLost: number, hourlyCost = env.DEFAULT_HOURLY_COST): number {
  return roundToTwoDecimals(monthlyHoursLost * hourlyCost);
}

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
