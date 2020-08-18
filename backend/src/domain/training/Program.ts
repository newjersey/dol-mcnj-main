export interface Program {
  programid: string;
  cipcode: string;
  officialname: string;
  description: string;
  providerid: string;
  totalcost: string;
  providername: string | null;
  calendarlengthid: string | null;
  website: string | null;
  street1: string | null;
  street2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  indemandcip: string | null;
  peremployed2: string | null;
  avgquarterlywage2: string | null;
  onlineprogramid: string | null;
}

export interface LocalException {
  cipcode: string;
  county: string;
}

export interface OccupationTitle {
  soc: string;
  soctitle: string;
}