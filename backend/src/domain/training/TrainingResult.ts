import { CalendarLength } from "../CalendarLength";
import { CipDefinition } from "./Program";

export interface TrainingResult {
  id?: string;
  name?: string;
  cipDefinition?: CipDefinition | null;
  totalCost?: number | null;
  percentEmployed?: number | null;
  calendarLength?: CalendarLength | null;
  totalClockHours?: number | null;
  inDemand?: boolean;
  localExceptionCounty?: string[];
  online?: boolean;
  providerId?: string | null;
  providerName?: string;
  cities?: (string | undefined)[];
  zipCodes?: (string | undefined)[];
  highlight?: string;
  rank?: number;
  socCodes?: string[];
  hasEveningCourses?: boolean;
  languages?: string[];
  isWheelchairAccessible?: boolean;
  hasJobPlacementAssistance?: boolean;
  hasChildcareAssistance?: boolean;
  availableAt: Address[];
}

type Address = {
  street_address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

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
