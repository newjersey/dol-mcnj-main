import { Occupation } from "../occupations/Occupation";
import {CalendarLength} from "../CalendarLength";
import {CipDefinition} from "./Program";

export interface Training {
  id?: string;
  name?: string;
  cipDefinition?: CipDefinition | null;
  provider: Provider;
  description?: string;
  certifications: string;
  prerequisites?: (string | undefined)[] | null;
  calendarLength?: CalendarLength | null;
  totalClockHours?: number | null;
  occupations: Occupation[];
  inDemand: boolean;
  localExceptionCounty: string[];
  tuitionCost?: number | null;
  feesCost?: number | null;
  booksMaterialsCost?: number | null;
  suppliesToolsCost?: number | null;
  otherCost?: number | null;
  totalCost?: number | null;
  online: boolean;
  percentEmployed: number | null;
  averageSalary?: number | null;
  hasEveningCourses: boolean;
  languages: string | null;
  isWheelchairAccessible: boolean;
  hasJobPlacementAssistance: boolean;
  hasChildcareAssistance: boolean;
  availableAt: Address
}

export interface Provider {
  id: string;
  url?: string;
  contactName?: string;
  contactTitle?: string;
  phoneNumber?: string;
  county?: string;
  phoneExtension?: string;
  email?: string;
  addresses?: Address;
  name: string;
  targetContactPoints?: ContactPoint[];
}

export interface Address {
  street_address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
}

export interface ContactPoint {
  alternateName?: string;
  contactType?: string;
  faxNumber?: string[];
  name?: string;
  socialMedia?: string[];
  email?: string[];
  telephone?: string[];
}

export interface ConditionProfile {
  name?: string;
  experience?: string;
  description?: string;
  yearsOfExperience?: string;
  targetAssessment: ConditionProfileItem[];
  targetCompetency: ConditionProfileItem[];
  targetCredential: ConditionProfileItem[];
  targetLearningOpportunity: ConditionProfileItem[];
}

export interface ConditionProfileItem {
  name?: string;
  provider?: Provider;
  description?: string;
}
