import { Program } from "../domain/Program";

const randomInt = (): number => Math.floor(Math.random() * Math.floor(10000000));

export const buildProgram = (overrides: Partial<Program>): Program => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    totalCost: randomInt(),
    percentEmployed: randomInt(),
    ...overrides,
  };
};
