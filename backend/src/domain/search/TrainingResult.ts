import {ApprovalStatus} from "../ApprovalStatus";
import {CalendarLength} from "../../../../frontend/src/domain/Training";

export interface TrainingResult {
  id: string;
  name: string;
  totalCost: number;
  percentEmployed: number | null;
  status: ApprovalStatus;
  calendarLength: CalendarLength;
  provider: ProviderResult;
  inDemand: boolean;
  localExceptionCounty: string[];
  highlight: string;
  rank: number;
  online: boolean;
}

export interface ProviderResult {
  city: string;
  id: string;
  name: string;
  status: ApprovalStatus;
}