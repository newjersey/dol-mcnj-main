import {CalendarLength} from "../CalendarLength";

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
  averageSalary: number | null;
}

export interface Provider {
  id: string;
  url: string;
  address: Address;
  name: string;
}

export interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}