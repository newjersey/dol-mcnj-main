import { Program, Provider, Status } from "../domain/Program";

export const randomInt = (): number => Math.floor(Math.random() * Math.floor(10000000));

export const buildProgram = (overrides: Partial<Program>): Program => {
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
