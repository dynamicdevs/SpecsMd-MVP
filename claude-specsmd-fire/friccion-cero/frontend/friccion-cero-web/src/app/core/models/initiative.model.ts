import { Complexity, InitiativeStatus, Priority } from './enums';

export interface Initiative {
  id: number;
  frictionId: number;
  title: string;
  proposedSolution: string;
  expectedReductionPercent: number;
  complexity: Complexity;
  priority: Priority;
  status: InitiativeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeCreate {
  frictionId: number;
  title: string;
  proposedSolution?: string;
  expectedReductionPercent?: number;
  complexity?: Complexity;
  priority?: Priority | null;
  status?: InitiativeStatus;
}

export type InitiativeUpdate = Partial<Omit<InitiativeCreate, 'frictionId'>>;
