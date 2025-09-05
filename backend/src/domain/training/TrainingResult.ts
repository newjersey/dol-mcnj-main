import { CalendarLength } from "../CalendarLength";
import {CipDefinition} from "./Program";
import {ProgramOutcome} from "./outcomes";

export interface TrainingResult {
  id: string;
  name: string;
  cipDefinition?: CipDefinition | null;
  totalCost: number;
  outcomes: ProgramOutcome;
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
