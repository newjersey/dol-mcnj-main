import { TrainingResult } from "../search/TrainingResult";
import { Address, Provider, Training } from "../training/Training";
import { Occupation } from "../careers/Occupation";
import { CalendarLength } from "../CalendarLength";
import {
  LocalException,
  NullableOccupationTitle,
  OccupationTitle,
  Program,
} from "../training/Program";

export const randomInt = (): number => Math.floor(Math.random() * Math.floor(10000000));
export const randomBool = (): boolean => !!Math.round(Math.random());

export const buildTrainingResult = (overrides: Partial<TrainingResult>): TrainingResult => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    totalCost: randomInt(),
    percentEmployed: randomInt(),
    calendarLength: randomCalendarLength(),
    inDemand: randomBool(),
    online: randomBool(),
    localExceptionCounty: [],
    highlight: "some-hightlight-" + randomInt(),
    rank: randomInt(),
    city: "some-city-" + randomInt(),
    zipCode: "some-zipcode-" + randomInt(),
    county: "some-county-" + randomInt(),
    providerId: "some-id-" + randomInt(),
    providerName: "some-provider-name-" + randomInt(),
    ...overrides,
  };
};

export const buildTraining = (overrides: Partial<Training>): Training => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    provider: buildProvider({}),
    description: "some-description-" + randomInt(),
    occupations: ["some-occupation-" + randomInt()],
    calendarLength: randomCalendarLength(),
    inDemand: randomBool(),
    localExceptionCounty: [],
    totalCost: randomInt(),
    online: randomBool(),
    percentEmployed: randomInt(),
    averageSalary: randomInt(),
    ...overrides,
  };
};

export const buildProvider = (overrides: Partial<Provider>): Provider => {
  return {
    id: "some-id-" + randomInt(),
    url: "some-url-" + randomInt(),
    address: buildAddress({}),
    name: "some-name-" + randomInt(),
    contactName: "some-contactName-" + randomInt(),
    contactTitle: "some-contactTitle-" + randomInt(),
    phoneNumber: "some-phoneNumber-" + randomInt(),
    phoneExtension: "some-phoneExtension-" + randomInt(),
    county: "some-county-" + randomInt(),
    ...overrides,
  };
};

export const buildAddress = (overrides: Partial<Address>): Address => {
  return {
    street1: "some-street1-" + randomInt(),
    street2: "some-street2-" + randomInt(),
    city: "some-city-" + randomInt(),
    state: "some-state-" + randomInt(),
    zipCode: "some-zipCode-" + randomInt(),
    ...overrides,
  };
};

export const buildOccupation = (overrides: Partial<Occupation>): Occupation => {
  return {
    soc: "some-soc-" + randomInt(),
    title: "some-title-" + randomInt(),
    majorGroup: "some-group-" + randomInt(),
    ...overrides,
  };
};

export const buildProgram = (overrides: Partial<Program>): Program => {
  return {
    programid: "some-programid-" + randomInt(),
    cipcode: "some-cipcode-" + randomInt(),
    officialname: "some-officialname-" + randomInt(),
    description: "some-description-" + randomInt(),
    providerid: "some-providerid-" + randomInt(),
    totalcost: randomInt().toString(),
    providername: "some-providername-" + randomInt(),
    calendarlengthid: randomCalendarLengthId(),
    website: "some-website-" + randomInt(),
    street1: "some-street1-" + randomInt(),
    street2: "some-street2-" + randomInt(),
    city: "some-city-" + randomInt(),
    state: "some-state-" + randomInt(),
    zip: "some-zip-" + randomInt(),
    county: "some-county-" + randomInt(),
    contactfirstname: "some-contactfirstname-" + randomInt(),
    contactlastname: "some-contactlastname-" + randomInt(),
    contacttitle: "some-contacttitle-" + randomInt(),
    phone: "some-phone-" + randomInt(),
    phoneextension: "some-phoneextension-" + randomInt(),
    indemandcip: "some-indemandcip-" + randomInt(),
    peremployed2: randomInt().toString(),
    avgquarterlywage2: randomInt().toString(),
    onlineprogramid: "some-onlineprogramid-" + randomInt(),
    ...overrides,
  };
};

export const buildOccupationTitle = (overrides: Partial<OccupationTitle>): OccupationTitle => {
  return {
    soc: "some-soc-" + randomInt(),
    soctitle: "some-soctitle-" + randomInt(),
    ...overrides,
  };
};

export const buildNullableOccupationTitle = (
  overrides: Partial<NullableOccupationTitle>
): NullableOccupationTitle => {
  return {
    soc: "some-soc-" + randomInt(),
    soctitle: "some-soctitle-" + randomInt(),
    ...overrides,
  };
};

export const buildLocalException = (overrides: Partial<LocalException>): LocalException => {
  return {
    cipcode: "some-cipcode-" + randomInt(),
    county: "some-county-" + randomInt(),
    ...overrides,
  };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const randomCalendarLength = (): CalendarLength => {
  const all: number[] = Object.keys(CalendarLength)
    .filter((k) => typeof CalendarLength[k as any] === "number")
    .map((key) => key as any);
  const randomIndex = Math.floor(Math.random() * all.length);
  return all[randomIndex];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const randomCalendarLengthId = (): string => {
  const all: any[] = Object.values(CalendarLength).filter(
    (k) => typeof CalendarLength[k as any] !== "number"
  );
  const randomIndex = Math.floor(Math.random() * all.length);
  return all[randomIndex].toString();
};
