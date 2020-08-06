export interface JoinedEntity {
  id: string;
  officialname: string;
  totalcost: string;
  peremployed2: string;
  providerid: string;
  city: string;
  statusname: string;
  providerstatus: string;
  providername: string;
  calendarlengthid: string;
  indemandcip: string;
  localexceptioncounty: string;
}

export interface ProgramEntity {
  id: string;
  cipcode: string;
  officialname: string;
  providerid: string;
  providername: string;
  calendarlengthid: string;
  website: string;
  description: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  indemandcip: string;
  localexceptioncounty: string;
}

export interface OccupationEntity {
  soc2018title: string;
}

export interface CountyEntity {
  county: string;
}

export interface IdCountyEntity {
  id: string;
  county: string;
}

export interface IdEntity {
  id: number;
}

export interface HeadlineEntity {
  descheadline: string;
  careerheadline: string;
}
