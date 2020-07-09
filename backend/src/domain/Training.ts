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

export enum Status {
  APPROVED = "Approved",
  SUSPENDED = "Suspend",
  PENDING = "Pending",
  UNKNOWN = "Unknown",
}
