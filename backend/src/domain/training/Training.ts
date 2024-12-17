import { Occupation } from "../occupations/Occupation";
import {CalendarLength} from "../CalendarLength";
import {CipDefinition} from "./Program";
import {DeliveryType} from "../DeliveryType";

export interface Training {
  ctid?: string;
  name?: string;
  cipDefinition?: CipDefinition | null;
  provider: Provider;
  description?: string;
  credentials: string;
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
  deliveryTypes: DeliveryType[] | undefined;
  percentEmployed: number | null;
  averageSalary?: number | null;
  hasEveningCourses: boolean;
  languages: string[] | null;
  isWheelchairAccessible: boolean;
  hasJobPlacementAssistance: boolean;
  hasChildcareAssistance: boolean;
  availableAt: Address[]
}

export interface Provider {
  ctid: string;
  providerId?: string;
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
export class Address {
  street_address?: string;
  city?:string;
  state?: string;
  zipCode?: string;
  county?: string;
  targetContactPoints?: ContactPoint[];

  constructor(init?: Partial<Address>) {
    Object.assign(this, init);
  }
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
