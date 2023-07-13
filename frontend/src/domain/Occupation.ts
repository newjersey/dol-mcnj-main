import { TrainingResult } from "./Training";

export interface InDemandOccupation {
  soc: string;
  title: string;
  majorGroup: string;
  counties: string[];
}

export interface Occupation {
  soc: string;
  title: string;
}

export interface OccupationDetail {
  soc: string;
  title: string;
  description: string;
  tasks: string[];
  education: string;
  inDemand: boolean;
  counties?: string[];
  medianSalary: number | null;
  openJobsCount: number | null;
  openJobsSoc?: number;
  relatedOccupations: Occupation[];
  relatedTrainings: TrainingResult[];
}
