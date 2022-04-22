import { TrainingResult } from "../training/TrainingResult";
import { Address, Provider, Training } from "../training/Training";
import {
  InDemandOccupation,
  Occupation,
  OccupationDetail,
  OccupationDetailPartial,
} from "../occupations/Occupation";
import { CalendarLength } from "../CalendarLength";
import { LocalException, NullableOccupation, Program, SocDefinition } from "../training/Program";

export const randomInt = (): number => Math.floor(Math.random() * Math.floor(10000000));
export const randomBool = (): boolean => !!Math.round(Math.random());

export const buildTrainingResult = (overrides: Partial<TrainingResult>): TrainingResult => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    cipCode: "some-cip-" + randomInt(),
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
    socCodes: ["some-soc-" + randomInt()],
    hasEveningCourses: randomBool(),
    languages: ["some-language-" + randomInt()],
    ...overrides,
  };
};

export const buildTraining = (overrides: Partial<Training>): Training => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    cipCode: "some-cip-" + randomInt(),
    provider: buildProvider({}),
    description: "some-description-" + randomInt(),
    certifications: "some-certifications-" + randomInt(),
    prerequisites: "some-certifications-" + randomInt(),
    occupations: [buildOccupation({})],
    calendarLength: randomCalendarLength(),
    inDemand: randomBool(),
    localExceptionCounty: [],
    tuitionCost: randomInt(),
    feesCost: randomInt(),
    booksMaterialsCost: randomInt(),
    suppliesToolsCost: randomInt(),
    otherCost: randomInt(),
    totalCost: randomInt(),
    online: randomBool(),
    percentEmployed: randomInt(),
    averageSalary: randomInt(),
    hasEveningCourses: randomBool(),
    languages: ["some-language-" + randomInt()],
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
    ...overrides,
  };
};

export const buildInDemandOccupation = (
  overrides: Partial<InDemandOccupation>
): InDemandOccupation => {
  return {
    soc: "some-soc-" + randomInt(),
    title: "some-title-" + randomInt(),
    majorGroup: "some-group-" + randomInt(),
    ...overrides,
  };
};

export const buildOccupationDetail = (overrides: Partial<OccupationDetail>): OccupationDetail => {
  return {
    soc: "some-soc-code-" + randomInt(),
    title: "some-title-" + randomInt(),
    description: "some-description-" + randomInt(),
    tasks: ["some-tasks-" + randomInt()],
    education: "some-education-" + randomInt(),
    inDemand: randomBool(),
    medianSalary: randomInt(),
    openJobsCount: randomInt(),
    relatedOccupations: [buildOccupation({})],
    relatedTrainings: [buildTrainingResult({})],
    ...overrides,
  };
};

export const buildOccupationDetailPartial = (
  overrides: Partial<OccupationDetailPartial>
): OccupationDetailPartial => {
  return {
    soc: "some-soc-code-" + randomInt(),
    title: "some-title-" + randomInt(),
    description: "some-description-" + randomInt(),
    tasks: ["some-tasks-" + randomInt()],
    relatedOccupations: [buildOccupation({})],
    ...overrides,
  };
};

export const buildProgram = (overrides: Partial<Program>): Program => {
  return {
    programid: "some-programid-" + randomInt(),
    cipcode: "some-cipcode-" + randomInt(),
    officialname: "some-officialname-" + randomInt(),
    description: "some-description-" + randomInt(),
    industrycredentialname: "tree identifier",
    prerequisites: "High School Diploma/G.E.D. or Ability To Benefit",
    providerid: "some-providerid-" + randomInt(),
    tuition: randomInt().toString(),
    fees: randomInt().toString(),
    booksmaterialscost: randomInt().toString(),
    suppliestoolscost: randomInt().toString(),
    othercosts: randomInt().toString(),
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
    eveningcourses: Math.random() < 0.5 ? "1" : "2",
    languages: "some-languages-" + randomInt(),
    ...overrides,
  };
};

export const buildSocDefinition = (overrides: Partial<SocDefinition>): SocDefinition => {
  return {
    soc: "some-soc-" + randomInt(),
    title: "some-soctitle-" + randomInt(),
    definition: "some-socdefinition-" + randomInt(),
    ...overrides,
  };
};

export const buildNullableOccupation = (
  overrides: Partial<NullableOccupation>
): NullableOccupation => {
  return {
    soc: "some-soc-" + randomInt(),
    title: "some-soctitle-" + randomInt(),
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
