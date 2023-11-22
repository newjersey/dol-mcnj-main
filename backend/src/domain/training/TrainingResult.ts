import { CalendarLength } from "../CalendarLength";

export interface TrainingResult {
  id: string;
  name: string;
  cipCode: string;
  totalCost: number;
  percentEmployed: number | null;
  calendarLength: CalendarLength;
  totalClockHours: number;
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
  socCodes: string[];
  hasEveningCourses: boolean;
  languages: string[];
  isWheelchairAccessible: boolean;
  hasJobPlacementAssistance: boolean;
  hasChildcareAssistance: boolean;
}
