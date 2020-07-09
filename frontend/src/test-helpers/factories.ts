import { Program, Provider } from "../domain/Program";

const randomInt = (): number => Math.floor(Math.random() * Math.floor(10000000));

export const buildProgram = (overrides: Partial<Program>): Program => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    totalCost: randomInt(),
    percentEmployed: randomInt(),
    provider: buildProvider({}),
    ...overrides,
  };
};

export const buildProvider = (overrides: Partial<Provider>): Provider => {
  return {
    id: "some-id-" + randomInt(),
    city: "some-city-" + randomInt(),
    name: "some-provider-name" + randomInt(),
    ...overrides,
  };
};
