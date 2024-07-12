import { CalendarLength } from "../CalendarLength";
import { CipDefinition } from "./Program";

export interface AllTrainingsResult {
  training_id: string;
  title: string;
  area: string;
  link: string;
  duration: number;
  soc: string;
  roi: number;
  soc3: string;
  id: string;
  method: string;
  soc_name: string;
  location: string;
  title_en: string;
  soc_name_en: string;
  title_es: string;
  soc_name_es: string;
  title_tl: string;
  soc_name_tl: string;
  title_zh: string;
  soc_name_zh: string;
  title_ja: string;
  soc_name_ja: string;
  duration_units: string;
  duration_slider_val_min: string;
  duration_slider_val_max: string;
  duration_units_en: string;
  duration_units_es: string;
  duration_units_tl: string;
  duration_units_zh: string;
  duration_units_ja: string;
}

export interface TrainingResult {
  ctid?: string;
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
  languages?: string | null;
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
