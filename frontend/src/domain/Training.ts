import { Occupation } from "./Occupation";

export interface TrainingResult {
  id: string;
  name: string;
  cipDefinition: CipDefinition;
  totalCost: number;
  percentEmployed: number | null;
  calendarLength: CalendarLength;
  totalClockHours?: number;
  inDemand: boolean;
  localExceptionCounty: string[];
  online: boolean;
  providerId: string;
  providerName: string;
  availableAt: Address;
  cities: string[];
  zipCodes: string[];
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

export interface Address {
  street_address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
}

type MetaData = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export interface TrainingData {
  data: TrainingResult[];
  meta: MetaData;
}

export interface Training {
  availableAt: Address;
  averageSalary: number | null;
  booksMaterialsCost: number;
  calendarLength: CalendarLength;
  certifications: ConditionProfile[];
  cipDefinition: CipDefinition;
  description: string;
  feesCost: number;
  hasChildcareAssistance: boolean;
  hasEveningCourses: boolean;
  hasJobPlacementAssistance: boolean;
  id: string;
  inDemand: boolean;
  isWheelchairAccessible: boolean;
  languages: string[];
  localExceptionCounty: string[];
  name: string;
  occupations: Occupation[];
  online: boolean;
  otherCost: number;
  percentEmployed: number | null;
  prerequisites: string;
  provider: Provider;
  suppliesToolsCost: number;
  totalClockHours?: number;
  totalCost: number;
  tuitionCost: number;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  url: string;
  addresses: Address[];
}

export interface Address {
  name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
  targetContactPoints?: ContactPoint[];
}

export interface ContactPoint {
  name?: string;
  alternateName?: string;
  contactType?: string;
  email?: string[];
  telephone?: string[];
  faxNumber?: string[];
  socialMedia?: string[];
}

export interface CipDefinition {
  cip: string;
  cipcode: string;
  ciptitle: string;
}

export interface ConditionProfile {
  name?: string;
  experience?: string;
  description?: string;
  yearsOfExperience?: number;
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

export enum CalendarLength {
  NULL = 0,
  LESS_THAN_ONE_DAY = 1,
  ONE_TO_TWO_DAYS = 2,
  THREE_TO_SEVEN_DAYS = 3,
  TWO_TO_THREE_WEEKS = 4,
  FOUR_TO_ELEVEN_WEEKS = 5,
  THREE_TO_FIVE_MONTHS = 6,
  SIX_TO_TWELVE_MONTHS = 7,
  THIRTEEN_MONTHS_TO_TWO_YEARS = 8,
  THREE_TO_FOUR_YEARS = 9,
  MORE_THAN_FOUR_YEARS = 10,
}
