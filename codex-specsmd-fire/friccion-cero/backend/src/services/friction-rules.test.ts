import { describe, expect, it } from "vitest";
import {
  classifyFrictionCategory,
  suggestAutomationPotential
} from "./friction-classification.service.js";
import { enrichFrictionInput } from "./friction-enrichment.service.js";
import {
  calculateEstimatedMonthlyCost,
  calculateMonthlyHoursLost
} from "./friction-impact.service.js";
import { suggestPriority } from "./friction-priority.service.js";

describe("friction impact calculations", () => {
  it("calculates monthly hours lost from minutes, frequency, and people affected", () => {
    const monthlyHoursLost = calculateMonthlyHoursLost({
      timeLostMinutes: 30,
      frequency: "weekly",
      peopleAffected: 4
    });

    expect(monthlyHoursLost).toBe(8);
  });

  it("uses occasional frequency as half an event per month", () => {
    const monthlyHoursLost = calculateMonthlyHoursLost({
      timeLostMinutes: 45,
      frequency: "occasional",
      peopleAffected: 2
    });

    expect(monthlyHoursLost).toBe(0.75);
  });

  it("calculates estimated monthly cost from hours and hourly cost", () => {
    expect(calculateEstimatedMonthlyCost(8, 50)).toBe(400);
  });

  it("rounds estimated monthly cost to two decimals", () => {
    expect(calculateEstimatedMonthlyCost(1.335, 33)).toBe(44.06);
  });
});

describe("friction classification", () => {
  it("classifies duplicated data from text", () => {
    const category = classifyFrictionCategory({
      title: "Duplicate customer entry",
      description: "The team must re-enter repeated data in two systems."
    });

    expect(category).toBe("data_duplication");
  });

  it("suggests high automation potential for integration problems", () => {
    expect(suggestAutomationPotential("missing_system_integration")).toBe("high");
  });

  it("suggests high automation potential for repeatable automation categories", () => {
    expect(suggestAutomationPotential("manual_repetitive_work")).toBe("high");
    expect(suggestAutomationPotential("data_duplication")).toBe("high");
    expect(suggestAutomationPotential("manual_approvals")).toBe("high");
  });
});

describe("friction priority", () => {
  it("suggests high priority for high pain and high monthly impact", () => {
    const priority = suggestPriority({
      monthlyHoursLost: 42,
      estimatedMonthlyCost: 2100,
      painLevel: "high",
      automationPotential: "high"
    });

    expect(priority).toBe("high");
  });

  it("suggests medium priority when combined impact is meaningful but not severe", () => {
    const priority = suggestPriority({
      monthlyHoursLost: 12,
      estimatedMonthlyCost: 600,
      painLevel: "medium",
      automationPotential: "low"
    });

    expect(priority).toBe("medium");
  });

  it("suggests low priority for low impact friction", () => {
    const priority = suggestPriority({
      monthlyHoursLost: 1,
      estimatedMonthlyCost: 25,
      painLevel: "low",
      automationPotential: "low"
    });

    expect(priority).toBe("low");
  });
});

describe("friction enrichment", () => {
  it("centralizes derived friction fields for API reuse", () => {
    const enriched = enrichFrictionInput(
      {
        title: "Manual approval delay",
        description: "Every request requires a manual approval and signature.",
        area: "Finance",
        frequency: "daily",
        timeLostMinutes: 15,
        peopleAffected: 6,
        painLevel: "high",
        status: "open"
      },
      40
    );

    expect(enriched).toMatchObject({
      category: "manual_repetitive_work",
      automationPotential: "high",
      monthlyHoursLost: 33,
      estimatedMonthlyCost: 1320,
      priority: "high"
    });
  });
});
