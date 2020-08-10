export interface TrainingResult {
  id: string;
  name: string;
  totalCost: number;
  percentEmployed: number | null;
  status: Status;
  calendarLength: CalendarLength;
  provider: ProviderResult;
  inDemand: boolean;
  localExceptionCounty: string[];
  highlight: string;
  online: boolean;
}

export interface ProviderResult {
  city: string;
  id: string;
  name: string;
  status: Status;
}

export interface Training {
  id: string;
  name: string;
  provider: Provider;
  description: string;
  calendarLength: CalendarLength;
  occupations: string[];
  inDemand: boolean;
  localExceptionCounty: string[];
  totalCost: number;
  online: boolean;
  percentEmployed: number | null;
}

export interface Provider {
  id: string;
  url: string;
  address: Address;
}

export interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}

export enum Status {
  APPROVED = "Approved",
  SUSPENDED = "Suspend",
  PENDING = "Pending",
  UNKNOWN = "Unknown",
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
