import {CalendarLength} from "../CalendarLength";

export interface TrainingResult {
  id: string;
  name: string;
  totalCost: number;
  percentEmployed: number | null;
  calendarLength: CalendarLength;
  provider: ProviderResult;
  inDemand: boolean;
  localExceptionCounty: string[];
  highlight: string;
  rank: number;
  online: boolean;
}

export interface ProviderResult {
  city: string;
  id: string;
  name: string;
}