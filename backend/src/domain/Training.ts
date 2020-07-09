export interface Training {
  id: string;
  name: string;
  totalCost: number;
  percentEmployed: number | null;
  status: Status;
  provider: Provider;
}

export interface Provider {
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
