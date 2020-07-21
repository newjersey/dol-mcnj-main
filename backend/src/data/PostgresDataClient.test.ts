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
    });
  });

  it("searches training ids when title, description matches a search query", async () => {
    const foundTrainings = await dataClient.search("tree");
    expect(foundTrainings).toEqual(expect.arrayContaining([1, 2, 5]));
  });

  it("finds trainings by list of ids", async () => {
    const foundTrainings = await dataClient.findTrainingsByIds(["1", "4"]);
    expect(foundTrainings.map((it) => it.name)).toEqual(
      expect.arrayContaining(["Tree Identification Class", "Mushroom Foraging Certification"])
    );
  });

  it("returns empty when id list is empty", async () => {
    const foundTrainings = await dataClient.findTrainingsByIds([]);
    expect(foundTrainings).toHaveLength(0);
  });

  it("finds training by ids", async () => {
    const foundTraining = await dataClient.findTrainingById("1");
    expect(foundTraining).toEqual({
      id: 1,
      name: "Tree Identification Class",
      calendarLength: CalendarLength.THREE_TO_FIVE_MONTHS,
      description:
        "This program is designed for clients who are interested in learning skills necessary " +
        "for todays modern tree identification jobs. Students will learn to distinguish types of trees by " +
        "their leaves and bark and seeds.",
      provider: {
        id: "123",
        url: "www.vineland.org/adulted",
      },
    });
  });

  it("returns empty values if url/calendar length does not exist", async () => {
    const foundTraining = await dataClient.findTrainingById("4");
    expect(foundTraining.calendarLength).toEqual(CalendarLength.NULL);
    expect(foundTraining.provider.url).toEqual("");
  });

  it("returns null enum if calendar length id does not exist", async () => {
    const foundTrainings = await dataClient.findTrainingsByIds(["4"]);
    expect(foundTrainings[0].calendarLength).toEqual(CalendarLength.NULL);
  });

  afterAll(async () => {
    dataClient.disconnect();
    await cmd("psql -c 'drop database d4adtest;' -U postgres -h localhost -p 5432");
  });
});
