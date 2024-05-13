import { TrainingResult } from "../training/TrainingResult";
import { Address, ContactPoint, Provider, Training } from "../training/Training";
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
    cipDefinition: {
      cip: "some-cip-" + randomInt(),
      cipcode: "some-cipcode-" + randomInt(),
      ciptitle: "some-ciptitle-" + randomInt(),
    },
    totalCost: randomInt(),
    percentEmployed: randomInt(),
    calendarLength: randomCalendarLength(),
    totalClockHours: randomInt(),
    inDemand: randomBool(),
    online: randomBool(),
    localExceptionCounty: [],
    highlight: "some-hightlight-" + randomInt(),
    rank: randomInt(),
    cities: ["some-city-" + randomInt(), "some-city-" + randomInt()],
    zipCodes: [randomInt().toString(), randomInt().toString()],
    providerId: "some-id-" + randomInt(),
    providerName: "some-provider-name-" + randomInt(),
    socCodes: ["some-soc-" + randomInt()],
    hasEveningCourses: randomBool(),
    languages: "some-language-" + randomInt(),
    isWheelchairAccessible: randomBool(),
    hasJobPlacementAssistance: randomBool(),
    hasChildcareAssistance: randomBool(),
    availableAt: {},
    ...overrides,
  };
};

export const buildTraining = (overrides: Partial<Training>): Training => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    cipDefinition: {
      cip: "some-cip-" + randomInt(),
      cipcode: "some-cipcode-" + randomInt(),
      ciptitle: "some-ciptitle-" + randomInt(),
    },
    provider: buildProvider({}),
    description: "some-description-" + randomInt(),
    certifications: "some-certifications-" + randomInt(),
    prerequisites: ["some-certifications-" + randomInt()],
    occupations: [buildOccupation({})],
    calendarLength: randomCalendarLength(),
    totalClockHours: randomInt(),
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
    languages: "some-language-" + randomInt(),
    isWheelchairAccessible: randomBool(),
    hasJobPlacementAssistance: randomBool(),
    hasChildcareAssistance: randomBool(),
    availableAt: {},
    ...overrides,
  };
};

export const buildProvider = (overrides: Partial<Provider>): Provider => {
  return {
    id: "some-id-" + randomInt(),
    url: "some-url-" + randomInt(),
    addresses: buildAddress({}),
    name: "some-name-" + randomInt(),
    ...overrides,
  };
};

export const buildAddress = (overrides: Partial<Address>): Address => {
  return {
    street_address: "some-name-" + randomInt(),
    city: "some-street1-" + randomInt(),
    zipCode: "some-zipCode-" + randomInt(),
    county: "some-county-" + randomInt(),
    ...overrides,
  };
};

export const buildContactPoint = (overrides: Partial<ContactPoint>): ContactPoint => {
  return {
    name: "some-name-" + randomInt(),
    alternateName: "some-alternateName-" + randomInt(),
    contactType: "some-contactType-" + randomInt(),
    email: ["some-email@a" + randomInt() + ".com"],
    telephone: ["(973) 555-5555"],
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
  overrides: Partial<InDemandOccupation>,
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
    counties: [],
    medianSalary: randomInt(),
    openJobsCount: randomInt(),
    relatedOccupations: [buildOccupation({})],
    //relatedTrainings: [buildTrainingResult({})],
    ...overrides,
  };
};

export const buildOccupationDetailPartial = (
  overrides: Partial<OccupationDetailPartial>,
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
    totalclockhours: randomInt().toString(),
    website: "some-website-" + randomInt(),
    street_address: "some-street-" + randomInt(),
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
    accessfordisabled: Math.random() < 0.5 ? "1" : "2",
    personalassist: Math.random() < 0.5 ? "1" : "2",
    childcare: Math.random() < 0.5 ? "1" : "2",
    assistobtainingchildcare: Math.random() < 0.5 ? "1" : "2",
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
  overrides: Partial<NullableOccupation>,
): NullableOccupation => {
  return {
    soc: "some-soc-" + randomInt(),
    title: "some-soctitle-" + randomInt(),
    ...overrides,
  };
};

export const buildLocalException = (overrides: Partial<LocalException>): LocalException => {
  return {
    soc: "some-soc-" + randomInt(),
    title: "some-soctitle-" + randomInt(),
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
    (k) => typeof CalendarLength[k as any] !== "number",
  );
  const randomIndex = Math.floor(Math.random() * all.length);
  return all[randomIndex].toString();
};
