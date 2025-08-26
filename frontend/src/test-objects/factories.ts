import * as crypto from "crypto";
import { Address, CalendarLength, CipDefinition, Provider, Training, TrainingResult } from "../domain/Training";
import { InDemandOccupation, Occupation, OccupationDetail } from "../domain/Occupation";
import { formatCip } from "../utils/formatCip";

const randomInt = (): number => crypto.randomInt(0, 10000000);

export const randomSixDigitNumber = (): number => {
  return crypto.randomInt(100000, 1000000);
};

const randomBool = (): boolean => crypto.randomInt(0, 2) === 1;

export const buildTrainingResult = (overrides: Partial<TrainingResult>): TrainingResult => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    cipDefinition: {
      cip: formatCip(randomSixDigitNumber().toString()),
      cipcode: randomSixDigitNumber().toString(),
      ciptitle: "some-ciptitle-" + randomInt(),
    },
    totalCost: randomInt(),
    percentEmployed: randomInt(),
    calendarLength: randomCalendarLength(),
    totalClockHours: randomInt(),
    inDemand: randomBool(),
    localExceptionCounty: ["some-county-" + randomInt()],
    online: randomBool(),
    providerId: "some-id-" + randomInt(),
    providerName: "some-provider-name-" + randomInt(),
    city: "some-city-" + randomInt(),
    zipCode: "some-zipcode-" + randomInt(),
    county: "some-county-" + randomInt(),
    highlight: "some-highlight-" + randomInt(),
    rank: randomInt(),
    socCodes: ["some-soc-" + randomInt()],
    hasEveningCourses: randomBool(),
    languages: ["some-language-" + randomInt()],
    isWheelchairAccessible: randomBool(),
    hasJobPlacementAssistance: randomBool(),
    hasChildcareAssistance: randomBool(),
    ...overrides,
  };
};

export const buildTraining = (overrides: Partial<Training>): Training => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    cipDefinition: buildCipDefinition({}),
    provider: buildProvider({}),
    calendarLength: randomCalendarLength(),
    totalClockHours: randomInt(),
    occupations: [buildOccupation({})],
    description: "some-description-" + randomInt(),
    certifications: "some-certifications-" + randomInt(),
    prerequisites: "some-certifications-" + randomInt(),
    inDemand: randomBool(),
    localExceptionCounty: ["some-county-" + randomInt()],
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
    isWheelchairAccessible: randomBool(),
    hasJobPlacementAssistance: randomBool(),
    hasChildcareAssistance: randomBool(),
    ...overrides,
  };
};

export const buildProvider = (overrides: Partial<Provider>): Provider => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-provider-name-" + randomInt(),
    url: "some-url-" + randomInt(),
    address: buildAddress({}),
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

export const buildCipDefinition = (overrides: Partial<CipDefinition>): CipDefinition => {
  const randomCipCode = randomSixDigitNumber().toString();
  return {
    cip: formatCip(randomCipCode),
    cipcode: randomCipCode,
    ciptitle: `some-ciptitle-${randomInt()}`,
  };
};

export const buildInDemandOccupation = (
  overrides: Partial<InDemandOccupation>,
): InDemandOccupation => {
  return {
    soc: "some-soc-" + randomInt(),
    title: "some-title-" + randomInt(),
    majorGroup: "some-group-" + randomInt(),
    counties: ["ATLANTIC", "MERCER"],
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

export const buildOccupationDetail = (overrides: Partial<OccupationDetail>): OccupationDetail => {
  return {
    soc: "some-soc-code-" + randomInt(),
    title: "some-title-" + randomInt(),
    description: "some-description-" + randomInt(),
    tasks: ["some-task-" + randomInt()],
    education: "some-eduction-text-" + randomInt(),
    inDemand: randomBool(),
    medianSalary: randomInt(),
    openJobsCount: randomInt(),
    relatedOccupations: [buildOccupation({})],
    relatedTrainings: [buildTrainingResult({})],
    ...overrides,
  };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const randomCalendarLength = (): CalendarLength => {
  const all: number[] = Object.keys(CalendarLength)
    .filter((k) => typeof CalendarLength[k as any] === "number")
    .map((key) => key as any);
  const randomIndex = crypto.randomInt(0, all.length);
  return all[randomIndex];
};
