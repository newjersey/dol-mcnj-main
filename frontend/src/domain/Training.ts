export interface TrainingResult {
  id: string;
  name: string;
  totalCost: number;
  percentEmployed: number | null;
  provider: ProviderResult;
}

export interface ProviderResult {
  id: string;
  city: string;
  name: string;
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
