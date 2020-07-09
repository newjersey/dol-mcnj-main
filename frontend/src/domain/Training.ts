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
