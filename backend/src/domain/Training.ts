export interface TrainingResult {
  id: string;
  name: string;
  totalCost: number;
  percentEmployed: number | null;
  status: Status;
  provider: ProviderResult;
}

export interface ProviderResult {
  city: string;
  id: string;
  name: string;
  status: Status;
}

export interface Training {
  id: string;
  name: string;
  provider: Provider;
}

export interface Provider {
  id: string;
  url: string;
}

export enum Status {
  APPROVED = "Approved",
  SUSPENDED = "Suspend",
  PENDING = "Pending",
  UNKNOWN = "Unknown",
}
