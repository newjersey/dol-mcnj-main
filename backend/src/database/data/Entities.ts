export interface JoinedEntity {
  programid: string;
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
  onlineprogram: string;
}

export interface ProgramEntity {
  programid: string;
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
  totalcost: string;
  onlineprogram: string;
  peremployed2: string;
  avgquarterlywage2: string;
}

export interface SocTitleEntity {
  soc2018title: string;
}

export interface OccupationEntity {
  soc: string;
  soctitle: string;
}

export interface IdEntity {
  programid: string;
}

export interface CountyEntity {
  county: string;
}

export interface IdCountyEntity {
  programid: string;
  county: string;
}