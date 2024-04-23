import { CalendarLength } from "../CalendarLength";

export interface TrainingResult {
  id?: string;
  name?: string;
  cipCode?: string;
  totalCost?: number | null;
  percentEmployed?: number | null;
  calendarLength?: CalendarLength;
  totalClockHours?: number;
  inDemand?: boolean;
  localExceptionCounty?: string[];
  online?: boolean;
  providerId?: string;
  providerName?: string;
  cities?: (string|undefined)[];
  zipCodes?: (string|undefined)[];
  highlight?: string;
  rank?: number;
  socCodes?: string[];
  hasEveningCourses?: boolean;
  languages?: string | null;
  isWheelchairAccessible?: boolean;
  hasJobPlacementAssistance?: boolean;
  hasChildcareAssistance?: boolean;
  availableAt: Address
}

type Address = {
  street_address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
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
    meta : MetaData;
}
