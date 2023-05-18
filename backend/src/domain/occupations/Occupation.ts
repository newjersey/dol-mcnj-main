import { TrainingResult } from "../training/TrainingResult";

export interface InDemandOccupation {
  soc: string;
  title: string;
  majorGroup: string;
  counties?: string[];
}

export interface Occupation {
  soc: string;
  title: string;
  counties?: string[];
}

export interface ExpandedOccupation extends Occupation {
  counties: string[];
}

export interface OccupationDetail {
  soc: string;
  title: string;
  description: string;
  tasks: string[];
  education: string;
  inDemand: boolean;
  medianSalary: number | null;
  openJobsCount: number | null;
  openJobsSoc?: string;
  relatedOccupations: Occupation[];
  relatedTrainings: TrainingResult[];
}

export interface OccupationDetailPartial {
  soc: string;
  title: string;
  description: string;
  tasks: string[];
  relatedOccupations: Occupation[];
}
