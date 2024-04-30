
import { findTrainingsByFactory } from './findTrainingsBy';
import mockAxios from 'jest-mock-axios';
import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { StubDataClient } from '../test-objects/StubDataClient';
import ceRecords from '../test-objects/ceTestData.json'
import expectedResult from './findTrainigsByExpectedTestData.json';

jest.mock("../../credentialengine/CredentialEngineAPI");

//TODO: FIX THIS
describe.skip('findTrainingsByFactory', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  beforeEach(() => {
    const getResultsCredentialEngineUtils = jest.spyOn(credentialEngineUtils, 'getCtidFromURL');
    getResultsCredentialEngineUtils.mockResolvedValue('');

    const getResultsCredentialEngineAPI = jest.spyOn(credentialEngineAPI, 'getResourceByCTID');
    getResultsCredentialEngineAPI.mockImplementation((ctid) => {
      if (!ctid || ctid === '') {
        return Promise.resolve(ceRecords[0]);
      }
      return Promise.resolve(ceRecords[1]);
    });
  });
  
  it('should return the correct trainings for selector "ID"', async () => {
    const dataClient = StubDataClient();
    dataClient.getCIPsInDemand = jest.fn().mockResolvedValue([
      { cip: '123', cipcode: '123', ciptitle: '123' },
    ]);
    dataClient.getLocalExceptionsByCip = jest.fn().mockResolvedValue([]);
    dataClient.findOccupationsByCip = jest.fn().mockResolvedValue([{title: 'test', soc: '123'}]);
    const findTrainingsBy = findTrainingsByFactory(dataClient);
    const trainings = await findTrainingsBy(1, ['a', 'b']);
    expect(trainings).toEqual(expectedResult);
  });
});
