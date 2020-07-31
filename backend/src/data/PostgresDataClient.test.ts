import { PostgresDataClient } from "./PostgresDataClient";
import util from "util";
import { exec } from "child_process";
import { CalendarLength, Status } from "../domain/Training";

const cmd = util.promisify(exec);

describe("PostgresDataClient", () => {
  let dataClient: PostgresDataClient;

  beforeAll(async () => {
    await cmd("psql -c 'create database d4adtest;' -U postgres -h localhost -p 5432");
    await cmd("npm run db-migrate up -- -e test");

    const connection = {
      user: "postgres",
      host: "localhost",
      database: "d4adtest",
      password: "",
      port: 5432,
    };
    dataClient = new PostgresDataClient(connection);
  });

  it("fetches data from multiple tables as training objects", async () => {
    const foundTrainings = await dataClient.findAllTrainings();
    expect(foundTrainings.length).toEqual(5);
    expect(foundTrainings).toContainEqual({
      id: 1,
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
    });
  });

  it("searches training ids when title, description matches a search query", async () => {
    const foundTrainings = await dataClient.search("tree");
    expect(foundTrainings).toEqual(expect.arrayContaining([1, 2, 5]));
  });

  it("finds trainings by list of ids", async () => {
    const foundTrainings = await dataClient.findTrainingResultsByIds(["1", "4"]);
    expect(foundTrainings.length).toEqual(2);
    expect(foundTrainings.map((it) => it.name)).toEqual(
      expect.arrayContaining(["Tree Identification Class", "Mushroom Foraging Certification"])
    );
  });

  it("returns empty when id list is empty", async () => {
    const foundTrainings = await dataClient.findTrainingResultsByIds([]);
    expect(foundTrainings).toHaveLength(0);
  });

  it("finds a training by id", async () => {
    const foundTraining = await dataClient.findTrainingById("1");
    expect(foundTraining).toEqual({
      id: 1,
      name: "Tree Identification Class",
      calendarLength: CalendarLength.THREE_TO_FIVE_MONTHS,
      description:
        "This program is designed for clients who are interested in learning skills necessary " +
        "for todays modern tree identification jobs. Students will learn to distinguish types of trees by " +
        "their leaves and bark and seeds.",
      occupations: ["Botanists"],
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
    });
  });

  it("returns inDemand as false when training cip is not on indemand list", async () => {
    const foundTraining = await dataClient.findTrainingById("3");
    expect(foundTraining.inDemand).toEqual(false);

    const foundTrainings = await dataClient.findTrainingResultsByIds(["3"]);
    expect(foundTrainings[0].inDemand).toEqual(false);
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

  afterAll(async () => {
    dataClient.disconnect();
    await cmd("psql -c 'drop database d4adtest;' -U postgres -h localhost -p 5432");
  });
});
