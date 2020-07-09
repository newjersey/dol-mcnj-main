export interface Program {
  id: string;
  name: string;
  totalCost: number;
  percentEmployed: number | null;
  provider: Provider;
}

export interface Provider {
  id: string;
  city: string;
  name: string;
}
