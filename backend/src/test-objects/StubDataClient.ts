export type StubDataClient = {
  findAllTrainingResults: jest.Mock;
  findTrainingResultsByIds: jest.Mock;
  findTrainingById: jest.Mock;
};

export const StubDataClient = (): StubDataClient => ({
  findAllTrainingResults: jest.fn(),
  findTrainingResultsByIds: jest.fn(),
  findTrainingById: jest.fn(),
});

export type StubSearchClient = {
  search: jest.Mock;
  getHighlight: jest.Mock;
};

export const StubSearchClient = (): StubSearchClient => ({
  search: jest.fn(),
  getHighlight: jest.fn(),
});
