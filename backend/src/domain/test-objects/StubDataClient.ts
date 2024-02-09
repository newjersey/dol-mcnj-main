export interface StubDataClient {
  findProgramsBy: jest.Mock;
  findOccupationsByCip: jest.Mock;
  findSocDefinitionBySoc: jest.Mock;
  findCipDefinitionBySoc2018: jest.Mock;
  find2018OccupationsBySoc2010: jest.Mock;
  find2010OccupationsBySoc2018: jest.Mock;
  findLocalExceptionsBySoc: jest.Mock;
  getLocalExceptionsByCip: jest.Mock;
  getLocalExceptionsBySoc: jest.Mock;
  getOccupationsInDemand: jest.Mock;
  getEducationTextBySoc: jest.Mock;
  getSalaryEstimateBySoc: jest.Mock;
  getOESOccupationBySoc: jest.Mock;
  getNeighboringOccupations: jest.Mock;
}

export const StubDataClient = (): StubDataClient => ({
  findProgramsBy: jest.fn(),
  findOccupationsByCip: jest.fn(),
  findSocDefinitionBySoc: jest.fn(),
  findCipDefinitionBySoc2018: jest.fn(),
  find2018OccupationsBySoc2010: jest.fn(),
  find2010OccupationsBySoc2018: jest.fn(),
  findLocalExceptionsBySoc: jest.fn(),
  getLocalExceptionsByCip: jest.fn(),
  getLocalExceptionsBySoc: jest.fn(),
  getOccupationsInDemand: jest.fn(),
  getEducationTextBySoc: jest.fn(),
  getSalaryEstimateBySoc: jest.fn(),
  getOESOccupationBySoc: jest.fn(),
  getNeighboringOccupations: jest.fn(),
});

export type StubSearchClient = {
  search: jest.Mock;
  getHighlight: jest.Mock;
};

export const StubSearchClient = (): StubSearchClient => ({
  search: jest.fn(),
  getHighlight: jest.fn(),
});
