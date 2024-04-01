import { Occupation } from "./Occupation";

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
  id: string;
  name: string;
  cipCode: string;
  calendarLength: CalendarLength;
  totalClockHours: number;
  description: string;
  certifications: ConditionProfile[];
  prerequisites: string;
  occupations: Occupation[];
  provider: Provider;
  inDemand: boolean;
  localExceptionCounty: string[];
  tuitionCost: number;
  feesCost: number;
  booksMaterialsCost: number;
  suppliesToolsCost: number;
  otherCost: number;
  totalCost: number;
  online: boolean;
  percentEmployed: number | null;
  averageSalary: number | null;
  hasEveningCourses: boolean;
  languages: string[];
  isWheelchairAccessible: boolean;
  hasJobPlacementAssistance: boolean;
  hasChildcareAssistance: boolean;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  url: string;
  addresses: Address[];
}

export interface Address {
  name: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  targetContactPoints: ContactPoint[];
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
