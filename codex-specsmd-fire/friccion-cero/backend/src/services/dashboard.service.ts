import type { FrictionCategory, FrictionStatus, Priority } from "../entities/friction.js";
import type { InitiativeStatus } from "../entities/initiative.js";
import type { FrictionRepository } from "../repositories/friction.repository.js";
import type { InitiativeRepository } from "../repositories/initiative.repository.js";

type DashboardFriction = {
  id: string;
  title: string;
  area: string;
  category: FrictionCategory;
  monthlyHoursLost: number;
  estimatedMonthlyCost: number;
  priority: Priority;
  status: FrictionStatus;
};

type DashboardInitiative = {
  status: InitiativeStatus;
};

type CountMap = Record<string, number>;

export type DashboardSummary = {
  totals: {
    frictions: number;
    monthlyHoursLost: number;
    estimatedMonthlyCost: number;
    initiatives: number;
  };
  initiativeCountsByStatus: CountMap;
  frictionCountsByCategory: CountMap;
  frictionCountsByPriority: CountMap;
  frictionCountsByStatus: CountMap;
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
};

export class DashboardService {
  public constructor(
    private readonly frictionRepository: FrictionRepository,
    private readonly initiativeRepository: InitiativeRepository
  ) {}

  public async getSummary(): Promise<DashboardSummary> {
    const frictions = (await this.frictionRepository.findAll()) as DashboardFriction[];
    const initiatives = (await this.initiativeRepository.findAll()) as DashboardInitiative[];

    return {
      totals: {
        frictions: frictions.length,
        monthlyHoursLost: round2(sum(frictions, "monthlyHoursLost")),
        estimatedMonthlyCost: round2(sum(frictions, "estimatedMonthlyCost")),
        initiatives: initiatives.length
      },
      initiativeCountsByStatus: countBy(initiatives, "status"),
      frictionCountsByCategory: countBy(frictions, "category"),
      frictionCountsByPriority: countBy(frictions, "priority"),
      frictionCountsByStatus: countBy(frictions, "status"),
      mostCostlyFrictions: [...frictions]
        .sort((left, right) => right.estimatedMonthlyCost - left.estimatedMonthlyCost)
        .slice(0, 5)
        .map((friction) => ({
          id: friction.id,
          title: friction.title,
          area: friction.area,
          category: friction.category,
          monthlyHoursLost: friction.monthlyHoursLost,
          estimatedMonthlyCost: friction.estimatedMonthlyCost,
          priority: friction.priority,
          status: friction.status
        }))
    };
  }
}

function countBy<T extends Record<K, string>, K extends keyof T>(items: T[], key: K): CountMap {
  return items.reduce<CountMap>((counts, item) => {
    counts[item[key]] = (counts[item[key]] ?? 0) + 1;
    return counts;
  }, {});
}

function sum<T extends Record<K, number>, K extends keyof T>(items: T[], key: K): number {
  return items.reduce((total, item) => total + item[key], 0);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
