import {StubDataClient} from "../../test-objects/StubDataClient";
import {FindTrainingById} from "../types";
import {findTrainingByIdFactory} from "./findTrainingById";
import {buildTraining} from "../../test-objects/factories";


describe("findTrainingById", () => {
  let findTrainingById: FindTrainingById;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    jest.resetAllMocks();
    stubDataClient = StubDataClient();
    findTrainingById = findTrainingByIdFactory(stubDataClient);
  });

  it("finds training by id", async () => {
    const training = buildTraining({ id: "123" });
    stubDataClient.findTrainingById.mockResolvedValue(training);

    expect(await findTrainingById("123")).toEqual(training);
  });

  it("rejects if id is empty/undefined", async () => {
    await expect(findTrainingById("")).rejects.toEqual("id is empty or undefined");
    await expect(findTrainingById(undefined)).rejects.toEqual("id is empty or undefined");
  });

  it("strips surrounding quotation marks from title/description of training", async () => {
    stubDataClient.findTrainingById.mockResolvedValue(
      buildTraining({
        name: '"Some Name with Quotes"',
        description: '"Some Name with Quotes"',
      })
    );

    expect((await findTrainingById("123")).name).toEqual("Some Name with Quotes");
    expect((await findTrainingById("123")).description).toEqual("Some Name with Quotes");

    stubDataClient.findTrainingById.mockResolvedValue(
      buildTraining({
        name: "Some Name without Quotes",
        description: "Some Name without Quotes",
      })
    );

    expect((await findTrainingById("123")).name).toEqual("Some Name without Quotes");
    expect((await findTrainingById("123")).description).toEqual("Some Name without Quotes");

    stubDataClient.findTrainingById.mockResolvedValue(
      buildTraining({
        name: '"Quotes "in the" middle too"',
        description: '"Quotes "in the" middle too"',
      })
    );

    expect((await findTrainingById("123")).name).toEqual('Quotes "in the" middle too');
    expect((await findTrainingById("123")).description).toEqual('Quotes "in the" middle too');

    stubDataClient.findTrainingById.mockResolvedValue(
      buildTraining({
        name: '"""Lots of Quotes"""',
        description: '"""Lots of Quotes"""',
      })
    );

    expect((await findTrainingById("123")).name).toEqual("Lots of Quotes");
    expect((await findTrainingById("123")).description).toEqual("Lots of Quotes");
  });

  it("title cases the local exception county", async () => {
    stubDataClient.findTrainingById.mockResolvedValue(
      buildTraining({
        localExceptionCounty: ["ATLANTIC"],
      })
    );

    expect((await findTrainingById("123")).localExceptionCounty).toEqual(["Atlantic"]);

    stubDataClient.findTrainingById.mockResolvedValue(
      buildTraining({
        localExceptionCounty: ["ATLANTIC COUNTY"],
      })
    );

    expect((await findTrainingById("123")).localExceptionCounty).toEqual(["Atlantic County"]);

    stubDataClient.findTrainingById.mockResolvedValue(
      buildTraining({
        localExceptionCounty: ["ATLANTIC", "MIDDLESEX"],
      })
    );

    expect((await findTrainingById("123")).localExceptionCounty).toEqual(["Atlantic", "Middlesex"]);

    stubDataClient.findTrainingById.mockResolvedValue(
      buildTraining({
        localExceptionCounty: [],
      })
    );

    expect((await findTrainingById("123")).localExceptionCounty).toEqual([]);
  });

  it("strips unicode inverted question marks from highlights", async () => {
    stubDataClient.findTrainingById.mockResolvedValue(
      buildTraining({
        description: "some ¿weird¿ character",
      })
    );

    expect((await findTrainingById("123")).description).toEqual("some weird character");
  });

  describe("error handling", () => {
    it("rejects when find by id is broken", (done) => {
      stubDataClient.findTrainingById.mockRejectedValue({});

      findTrainingById("id").catch(() => done());
    });
  });
});
