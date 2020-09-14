export interface Occupation {
  soc: string;
  title: string;
  majorGroup: string;
}

export interface OccupationDetail {
  soc: string;
  title: string;
  description: string;
  tasks: string[];
  education: string;
}

export interface OccupationDetailPartial {
  soc: string;
  title: string;
  description: string;
  tasks: string[];
}
