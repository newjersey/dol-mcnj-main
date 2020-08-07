import {PostgresDataClient} from "./PostgresDataClient";
import {CalendarLength, Status} from "../../domain/Training";
import {Error} from "../../domain/Error";

describe("PostgresDataClient", () => {
  let dataClient: PostgresDataClient;

  beforeAll(async () => {
    const connection = {
      user: "postgres",
      host: "localhost",
      database: "d4adtest",
      password: "",
      port: 5432,
    };
    dataClient = new PostgresDataClient(connection);
  });

  it("fetches data from multiple tables as training result objects", async () => {
    const trainingResults = await dataClient.findAllTrainingResults();
    expect(trainingResults.length).toEqual(6);
    expect(trainingResults).toContainEqual({
      id: "1",
      name: "Tree Identification Class",
      totalCost: 3035,
      percentEmployed: 0,
      status: Status.APPROVED,
      calendarLength: CalendarLength.THREE_TO_FIVE_MONTHS,
      provider: {
        id: "123",
        city: "Vineland",
        name: "Vineland Public Schools Adult Education Program",
        status: Status.SUSPENDED,
      },
      inDemand: true,
      highlight: "",
      localExceptionCounty: ["ATLANTIC", "MIDDLESEX"],
    });
  });

  it("finds training results by list of ids", async () => {
    const trainingResults = await dataClient.findTrainingResultsByIds(["1", "4"]);
    expect(trainingResults.length).toEqual(2);
    expect(trainingResults.map((it) => it.name)).toEqual(
      expect.arrayContaining(["Tree Identification Class", "Mushroom Foraging Certification"])
    );
  });

  it("preserves order of input list of ids", async () => {
    const trainingResults = await dataClient.findTrainingResultsByIds(["4", "1"]);
    expect(trainingResults.length).toEqual(2);
    expect(trainingResults[0].name).toEqual("Mushroom Foraging Certification");
    expect(trainingResults[1].name).toEqual("Tree Identification Class");
  });

  it("returns empty when id list is empty", async () => {
    const trainingResults = await dataClient.findTrainingResultsByIds([]);
    expect(trainingResults).toHaveLength(0);
  });

  it("finds a training by id", async () => {
    const foundTraining = await dataClient.findTrainingById("1");
    expect(foundTraining).toEqual({
      id: "1",
      name: "Tree Identification Class",
      calendarLength: CalendarLength.THREE_TO_FIVE_MONTHS,
      description:
        "This program is designed for clients who are interested in learning skills necessary " +
        "for todays modern tree identification jobs. Students will learn to distinguish types of trees by " +
        "their leaves and bark and seeds.",
      occupations: ["Botanists"],
      totalCost: 3035,
      provider: {
        id: "123",
        url: "www.vineland.org/adulted",
        address: {
          street1: "48 W. Landis Ave.",
          street2: "",
          city: "Vineland",
          state: "NJ",
          zipCode: "08360",
        },
      },
      inDemand: true,
      localExceptionCounty: ["ATLANTIC", "MIDDLESEX"],
    });
  });

  it("returns inDemand as false when training cip is not on indemand list", async () => {
    const foundTraining = await dataClient.findTrainingById("3");
    expect(foundTraining.inDemand).toEqual(false);

    const foundTrainings = await dataClient.findTrainingResultsByIds(["3"]);
    expect(foundTrainings[0].inDemand).toEqual(false);
  });

  it("returns localExceptionCounty as empty array when training cip is not on local exception list", async () => {
    const foundTraining = await dataClient.findTrainingById("3");
    expect(foundTraining.localExceptionCounty).toEqual([]);

    const foundTrainings = await dataClient.findTrainingResultsByIds(["3"]);
    expect(foundTrainings[0].localExceptionCounty).toEqual([]);
  });

  it("gets list of all occupations for a training's cip code", async () => {
    const foundTraining = await dataClient.findTrainingById("3");
    expect(foundTraining.occupations).toEqual(["Botanists", "Chefs"]);
  });

  it("returns empty values if url/calendar length does not exist", async () => {
    const foundTraining = await dataClient.findTrainingById("4");
    expect(foundTraining.calendarLength).toEqual(CalendarLength.NULL);
    expect(foundTraining.provider.url).toEqual("");
  });

  it("returns null enum if calendar length id does not exist", async () => {
    const foundTrainings = await dataClient.findTrainingResultsByIds(["4"]);
    expect(foundTrainings[0].calendarLength).toEqual(CalendarLength.NULL);
  });

  it("throws with a not found error if id does not exist", async () => {
    return dataClient.findTrainingById('99999')
      .catch((e) => {
        expect(e).toEqual(Error.NOT_FOUND)
      })
  });

  it("throws with a not found error if id does not exist", async () => {
    return dataClient.findTrainingById('doesnotexist')
      .catch((e) => {
        expect(e).toEqual(Error.NOT_FOUND)
      })
  });

  afterAll(async () => {
    await dataClient.disconnect();
  });
});
