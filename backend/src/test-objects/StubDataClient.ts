export type StubDataClient = {
  findAllTrainings: jest.Mock;
  search: jest.Mock;
  findTrainingsByIds: jest.Mock;
  findTrainingById: jest.Mock;
};

export const StubDataClient = (): StubDataClient => ({
  findAllTrainings: jest.fn(),
  search: jest.fn(),
  findTrainingsByIds: jest.fn(),
  findTrainingById: jest.fn(),
});
