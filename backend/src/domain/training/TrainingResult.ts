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
  providerId: string;
  providerName: string;
  city: string;
  zipCode: string;
  county: string;
  highlight: string;
  rank: number;
}
