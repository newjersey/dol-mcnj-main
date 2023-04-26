import { CalendarLength } from "../CalendarLength";

export interface TrainingResult {
  id: string;
  name: string;
  cipCode: string;
  totalCost: number;
  // percentEmployed: AggregateDataProfile[] | null;
  calendarLength: CalendarLength;
  inDemand: boolean;
  localExceptionCounty: string[];
  online: boolean;
  providerId: string;
  providerName: string;
  cities: (string|undefined)[];
  zipCodes: (string|undefined)[];
  highlight: string;
  rank: number;
  socCodes: string[];
  hasEveningCourses: boolean;
  languages: string[];
  isWheelchairAccessible: boolean;
  hasJobPlacementAssistance: boolean;
  hasChildcareAssistance: boolean;
}
