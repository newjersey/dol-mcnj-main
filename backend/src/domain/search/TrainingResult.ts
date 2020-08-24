import { CalendarLength } from "../CalendarLength";

export interface TrainingResult {
  id: string;
  name: string;
  totalCost: number;
  percentEmployed: number | null;
  calendarLength: CalendarLength;
  inDemand: boolean;
  localExceptionCounty: string[];
  online: boolean;
  city: string;
  zipCode: string;
  providerId: string;
  providerName: string;
  highlight: string;
  rank: number;
}
