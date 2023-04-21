import { CalendarLength } from "../CalendarLength";
import { Occupation } from "../occupations/Occupation";
import {Ceterms } from "../credentialengine/CredentialEngine";

export interface Training {
  id: string;
  name: string;
  cipCode: string;
  provider: Provider;
  description: string;
  certifications: string;
  prerequisites: string;
  calendarLength: CalendarLength;
  occupations: Occupation[];
  inDemand: boolean;
  localExceptionCounty: string[];
  tuitionCost: number;
  feesCost: number;
  booksMaterialsCost: number;
  suppliesToolsCost: number;
  otherCost: number;
  totalCost: number;
  online: boolean;
  percentEmployed: AggregateDataProfile[] | null;
  averageSalary: number | null;
  hasEveningCourses: boolean;
  languages: string[];
  isWheelchairAccessible: boolean;
  hasJobPlacementAssistance: boolean;
  hasChildcareAssistance: boolean;
}

export interface Provider {
  id: string;
  url?: string;
  email?: string;
  addresses?: Address[];
  name: string;
  targetContactPoints?: ContactPoint[];
}

export interface Address {
  name?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  targetContactPoints?: ContactPoint[];
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

export interface AggregateDataProfile {
  dateEffective?:     string;
  description?:       string;
  expirationDate?:    string;
  jobsObtained?:      SchemaQuantitativeValue[];
  highEarnings?:      number;
  lowEarnings?:       number;
  medianEarnings?:    number;
  name?:              string;
  numberAwarded?:     number;
  postReceiptMonths?: number;
  source?:            string;
}

export interface SchemaQuantitativeValue {
  percentage:  number;
  description: Ceterms;
  maxValue:    number;
  minValue:    number;
  unitText:    string;
  value:       number;
}
