export interface Program {
  programid: string;
  cipcode: string;
  officialname: string;
  description: string | null;
  industrycredentialname: string;
  prerequisites: string;
  providerid: string;
  tuition: string;
  fees: string;
  booksmaterialscost: string;
  suppliestoolscost: string;
  othercosts: string;
  totalcost: string;
  providername: string | null;
  calendarlengthid: string | null;
  website: string | null;
  street1: string | null;
  street2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  county: string;
  contactfirstname: string | null;
  contactlastname: string | null;
  contacttitle: string | null;
  phone: string | null;
  phoneextension: string | null;
  indemandcip: string | null;
  peremployed2: string | null;
  avgquarterlywage2: string | null;
  onlineprogramid: string | null;
  eveningcourses: string;
  languages: string | null;
  accessfordisabled: string | null;
  personalassist: string | null;
  childcare: string | null;
  assistobtainingchildcare: string | null;
}

export interface LocalException {
  cipcode: string;
  county: string;
}

export interface SocDefinition {
  soc: string;
  title: string;
  definition: string;
}

export interface CipDefinition {
  cipcode: string;
  ciptitle: string;
}

export interface NullableOccupation {
  soc: string;
  title: string | null;
}

export interface EducationText {
  howtobecomeone: string;
}

export interface SalaryEstimate {
  mediansalary: string;
}
