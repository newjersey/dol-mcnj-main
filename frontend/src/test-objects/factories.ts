import { Address, CalendarLength, Provider, Training, TrainingResult } from "../domain/Training";
import { InDemandOccupation, Occupation, OccupationDetail } from "../domain/Occupation";

const randomInt = (): number => Math.floor(Math.random() * Math.floor(10000000));
const randomBool = (): boolean => !!Math.round(Math.random());

export const buildTrainingResult = (overrides: Partial<TrainingResult>): TrainingResult => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    cipCode: "some-cip-" + randomInt(),
    totalCost: randomInt(),
    percentEmployed: randomInt(),
    calendarLength: randomCalendarLength(),
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
    cipCode: "some-cip-" + randomInt(),
    provider: buildProvider({}),
    calendarLength: randomCalendarLength(),
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

export const buildInDemandOccupation = (
  overrides: Partial<InDemandOccupation>
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
  const randomIndex = Math.floor(Math.random() * all.length);
  return all[randomIndex];
};
