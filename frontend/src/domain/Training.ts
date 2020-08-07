export interface TrainingResult {
  id: string;
  name: string;
  totalCost: number;
  percentEmployed: number | null;
  calendarLength: CalendarLength;
  provider: ProviderResult;
  inDemand: boolean;
  highlight: string;
  localExceptionCounty: string[];
}

export interface ProviderResult {
  id: string;
  city: string;
  name: string;
}

export interface Training {
  id: string;
  name: string;
  calendarLength: CalendarLength;
  description: string;
  occupations: string[];
  provider: Provider;
  inDemand: boolean;
  localExceptionCounty: string[];
  totalCost: number;
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
