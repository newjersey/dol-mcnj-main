import {GetInDemandOccupations} from "../types";
import {StubDataClient} from "../../test-objects/StubDataClient";
import {getInDemandOccupationsFactory} from "./getInDemandOccupations";
import {buildOccupationTitle} from "../../test-objects/factories";

describe('getInDemandOccupations', () => {

  let getInDemandOccupations: GetInDemandOccupations;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    stubDataClient = StubDataClient();
    getInDemandOccupations = getInDemandOccupationsFactory(stubDataClient);
  })

  it('gets in-demand occupations and the major group for each one', async () => {
    stubDataClient.getInDemandOccupationTitles.mockResolvedValue([
      buildOccupationTitle({ soctitle: 'soc 1', soc: '1'}),
      buildOccupationTitle({ soctitle: 'soc 2', soc: '2'}),
    ])

    stubDataClient.findOccupationTitleBySoc
      .mockResolvedValueOnce(buildOccupationTitle({soctitle: 'soc group 1'}))
      .mockResolvedValueOnce(buildOccupationTitle({soctitle: 'soc group 2'}))

    const occupations = await getInDemandOccupations();
    expect(occupations).toEqual([
      {
        soc: '1',
        title: 'soc 1',
        majorGroup: 'soc group 1',
      },
      {
        soc: '2',
        title: 'soc 2',
        majorGroup: 'soc group 2',
      }
    ])
  })

  it('gets the major group by finding the first 2 numbers of the soc', async () => {
    stubDataClient.getInDemandOccupationTitles.mockResolvedValueOnce([buildOccupationTitle({soc: '11-1234'})])
    stubDataClient.findOccupationTitleBySoc.mockResolvedValue(buildOccupationTitle({}))
    await getInDemandOccupations();
    expect(stubDataClient.findOccupationTitleBySoc).toHaveBeenLastCalledWith('11-0000')
  })
});