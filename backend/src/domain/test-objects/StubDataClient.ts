export interface StubDataClient {
  findProgramsByIds: jest.Mock;
  getLocalExceptions: jest.Mock;
  findOccupationTitlesByCip: jest.Mock;
  findSocDefinitionBySoc: jest.Mock;
  find2018OccupationTitlesBySoc2010: jest.Mock;
  find2010OccupationTitlesBySoc2018: jest.Mock;
  getInDemandOccupationTitles: jest.Mock;
  getEducationTextBySoc: jest.Mock;
  getSalaryEstimateBySoc: jest.Mock;
  getOESCodeBySoc: jest.Mock;
}

export const StubDataClient = (): StubDataClient => ({
  findProgramsByIds: jest.fn(),
  getLocalExceptions: jest.fn(),
  findOccupationTitlesByCip: jest.fn(),
  findSocDefinitionBySoc: jest.fn(),
  find2018OccupationTitlesBySoc2010: jest.fn(),
  find2010OccupationTitlesBySoc2018: jest.fn(),
  getInDemandOccupationTitles: jest.fn(),
  getEducationTextBySoc: jest.fn(),
  getSalaryEstimateBySoc: jest.fn(),
  getOESCodeBySoc: jest.fn(),
});

export type StubSearchClient = {
  search: jest.Mock;
  getHighlight: jest.Mock;
};

export const StubSearchClient = (): StubSearchClient => ({
  search: jest.fn(),
  getHighlight: jest.fn(),
});
