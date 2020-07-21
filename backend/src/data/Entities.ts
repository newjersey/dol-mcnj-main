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
}

export interface OccupationEntity {
  soc2018title: string;
}

export interface SearchedEntity {
  id: string;
}
