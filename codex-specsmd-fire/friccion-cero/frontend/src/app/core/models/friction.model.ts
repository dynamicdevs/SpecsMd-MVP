export type FrictionCategory =
  | 'manual_repetitive_work'
  | 'third_party_waiting'
  | 'data_duplication'
  | 'unnecessary_meetings'
  | 'manual_approvals'
  | 'missing_system_integration'
  | 'excessive_information_search'
  | 'recurring_human_errors'
  | 'lack_of_traceability'
  | 'unclassified';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'occasional';
export type PainLevel = 'low' | 'medium' | 'high';
export type AutomationPotential = 'low' | 'medium' | 'high';
export type Priority = 'low' | 'medium' | 'high';
export type FrictionStatus = 'open' | 'in_review' | 'resolved' | 'archived';

export interface Friction {
  id: string;
  title: string;
  description: string;
  area: string;
  category: FrictionCategory;
  frequency: Frequency;
  timeLostMinutes: number;
  peopleAffected: number;
  painLevel: PainLevel;
  automationPotential: AutomationPotential;
  monthlyHoursLost: number;
  estimatedMonthlyCost: number;
  priority: Priority;
  status: FrictionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FrictionComment {
  id: string;
  frictionId: string;
  comment: string;
  createdAt: string;
}

export interface FrictionRelatedInitiative {
  id: string;
  frictionId: string;
  title: string;
  proposedSolution: string;
  expectedReductionPercent: number;
  complexity: 'low' | 'medium' | 'high';
  priority: Priority;
  status: 'proposed' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface FrictionDetail extends Friction {
  comments?: FrictionComment[];
  initiatives?: FrictionRelatedInitiative[];
}

export type CreateFrictionRequest = Pick<
  Friction,
  'title' | 'description' | 'area' | 'frequency' | 'timeLostMinutes' | 'peopleAffected' | 'painLevel'
> &
  Partial<Pick<Friction, 'status'>>;

export type UpdateFrictionRequest = Partial<
  Pick<
    Friction,
    | 'title'
    | 'description'
    | 'area'
    | 'category'
    | 'frequency'
    | 'timeLostMinutes'
    | 'peopleAffected'
    | 'painLevel'
    | 'automationPotential'
    | 'status'
  >
>;
