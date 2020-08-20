export interface StubDataClient {
  findProgramsByIds: jest.Mock;
  getLocalExceptions: jest.Mock;
  findOccupationTitlesByCip: jest.Mock;
  findOccupationTitleBySoc: jest.Mock;
  find2018OccupationTitlesBySoc2010: jest.Mock;
  getInDemandOccupationTitles: jest.Mock;
}

export const StubDataClient = (): StubDataClient => ({
  findProgramsByIds: jest.fn(),
  getLocalExceptions: jest.fn(),
  findOccupationTitlesByCip: jest.fn(),
  findOccupationTitleBySoc: jest.fn(),
  find2018OccupationTitlesBySoc2010: jest.fn(),
  getInDemandOccupationTitles: jest.fn(),
});

export type StubSearchClient = {
  search: jest.Mock;
  getHighlight: jest.Mock;
};

export const StubSearchClient = (): StubSearchClient => ({
  search: jest.fn(),
  getHighlight: jest.fn(),
});
