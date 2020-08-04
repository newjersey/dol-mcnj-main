import {
  TrainingResult,
  ProviderResult,
  Training,
  Provider,
  CalendarLength,
  Address,
} from "../domain/Training";

const randomInt = (): number => Math.floor(Math.random() * Math.floor(10000000));

export const buildTrainingResult = (overrides: Partial<TrainingResult>): TrainingResult => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    totalCost: randomInt(),
    percentEmployed: randomInt(),
    provider: buildProviderResult({}),
    calendarLength: randomCalendarLength(),
    inDemand: !!Math.round(Math.random()),
    highlight: "some-highlight-" + randomInt(),
    ...overrides,
  };
};

export const buildProviderResult = (overrides: Partial<ProviderResult>): ProviderResult => {
  return {
    id: "some-id-" + randomInt(),
    city: "some-city-" + randomInt(),
    name: "some-provider-name-" + randomInt(),
    ...overrides,
  };
};

export const buildTraining = (overrides: Partial<Training>): Training => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    provider: buildProvider({}),
    calendarLength: randomCalendarLength(),
    occupations: ["some-occupation-" + randomInt()],
    description: "some-description-" + randomInt(),
    inDemand: !!Math.round(Math.random()),
    ...overrides,
  };
};

export const buildProvider = (overrides: Partial<Provider>): Provider => {
  return {
    id: "some-id-" + randomInt(),
    url: "some-url-" + randomInt(),
    address: buildAddress({}),
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

/* eslint-disable @typescript-eslint/no-explicit-any */
export const randomCalendarLength = (): CalendarLength => {
  const all: number[] = Object.keys(CalendarLength)
    .filter((k) => typeof CalendarLength[k as any] === "number")
    .map((key) => key as any);
  const randomIndex = Math.floor(Math.random() * all.length);
  return all[randomIndex];
};
