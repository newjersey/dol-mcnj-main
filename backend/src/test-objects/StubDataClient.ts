export interface StubDataClient {
  findProgramsByIds: jest.Mock;
  getLocalExceptions: jest.Mock;
  findOccupationTitlesByCip: jest.Mock;
  getInDemandOccupations: jest.Mock;
}

export const StubDataClient = (): StubDataClient => ({
  findProgramsByIds: jest.fn(),
  getLocalExceptions: jest.fn(),
  findOccupationTitlesByCip: jest.fn(),
  getInDemandOccupations: jest.fn(),
});

export type StubSearchClient = {
  search: jest.Mock;
  getHighlight: jest.Mock;
};

export const StubSearchClient = (): StubSearchClient => ({
  search: jest.fn(),
  getHighlight: jest.fn(),
});
