import type { Friction, Priority } from './friction.model';

export type InitiativeComplexity = 'low' | 'medium' | 'high';
export type InitiativeStatus = 'proposed' | 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface Initiative {
  id: string;
  frictionId: string;
  title: string;
  proposedSolution: string;
  expectedReductionPercent: number;
  complexity: InitiativeComplexity;
  priority: Priority;
  status: InitiativeStatus;
  createdAt: string;
  updatedAt: string;
  friction?: Pick<Friction, 'id' | 'title' | 'area' | 'priority' | 'status'>;
}

export type CreateInitiativeRequest = Pick<
  Initiative,
  'title' | 'proposedSolution' | 'expectedReductionPercent' | 'complexity'
> &
  Partial<Pick<Initiative, 'priority' | 'status'>>;

export type UpdateInitiativeRequest = Partial<Omit<CreateInitiativeRequest, never>>;
