import { Training, Provider, Status } from "../domain/Training";

export const randomInt = (): number => Math.floor(Math.random() * Math.floor(10000000));

export const buildTraining = (overrides: Partial<Training>): Training => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    totalCost: randomInt(),
    percentEmployed: randomInt(),
    provider: buildProvider({}),
    status: randomStatus(),
    ...overrides,
  };
};

export const buildProvider = (overrides: Partial<Provider>): Provider => {
  return {
    id: "some-id-" + randomInt(),
    city: "some-city-" + randomInt(),
    name: "some-provider-name-" + randomInt(),
    status: randomStatus(),
    ...overrides,
  };
};

export const randomStatus = (): Status => {
  const allStatuses: Status[] = Object.keys(Status).map((key) => key as Status);
  const randomIndex = Math.random() * allStatuses.length;
  return allStatuses[randomIndex];
};
