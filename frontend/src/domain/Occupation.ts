export interface InDemandOccupation {
  soc: string;
  title: string;
  majorGroup: string;
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
  medianSalary: number | null;
  openJobsCount: number | null;
  relatedOccupations: Occupation[];
}
