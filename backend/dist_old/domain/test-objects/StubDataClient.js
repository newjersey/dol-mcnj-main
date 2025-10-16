"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StubSearchClient = exports.StubDataClient = void 0;
const StubDataClient = () => ({
    findProgramsBy: jest.fn(),
    findOccupationsByCip: jest.fn(),
    findSocDefinitionBySoc: jest.fn(),
    findCipDefinitionBySoc2018: jest.fn(),
    findCipDefinitionByCip: jest.fn(),
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
exports.StubDataClient = StubDataClient;
const StubSearchClient = () => ({
    search: jest.fn(),
    getHighlight: jest.fn(),
});
exports.StubSearchClient = StubSearchClient;
