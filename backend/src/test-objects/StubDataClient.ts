export type StubDataClient = {
  findAllTrainings: jest.Mock;
  search: jest.Mock;
  findTrainingResultsByIds: jest.Mock;
  findTrainingById: jest.Mock;
};

export const StubDataClient = (): StubDataClient => ({
  findAllTrainings: jest.fn(),
  search: jest.fn(),
  findTrainingResultsByIds: jest.fn(),
  findTrainingById: jest.fn(),
});
