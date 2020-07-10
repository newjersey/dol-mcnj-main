import { TrainingResult, ProviderResult, Status, Training, Provider } from "../domain/Training";

export const randomInt = (): number => Math.floor(Math.random() * Math.floor(10000000));

export const buildTrainingResult = (overrides: Partial<TrainingResult>): TrainingResult => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    totalCost: randomInt(),
    percentEmployed: randomInt(),
    provider: buildProviderResult({}),
    status: randomStatus(),
    ...overrides,
  };
};

export const buildProviderResult = (overrides: Partial<ProviderResult>): ProviderResult => {
  return {
    id: "some-id-" + randomInt(),
    city: "some-city-" + randomInt(),
    name: "some-provider-name-" + randomInt(),
    status: randomStatus(),
    ...overrides,
  };
};

export const buildTraining = (overrides: Partial<Training>): Training => {
  return {
    id: "some-id-" + randomInt(),
    name: "some-name-" + randomInt(),
    provider: buildProvider({}),
    ...overrides,
  };
};

export const buildProvider = (overrides: Partial<Provider>): Provider => {
  return {
    id: "some-id-" + randomInt(),
    url: "some-url-" + randomInt(),
    ...overrides,
  };
};

export const randomStatus = (): Status => {
  const allStatuses: Status[] = Object.keys(Status).map((key) => key as Status);
  const randomIndex = Math.random() * allStatuses.length;
  return allStatuses[randomIndex];
};
