import { PostgresDataClient } from "./PostgresDataClient";
import util from "util";
import { exec } from "child_process";
import { Status } from "../domain/Program";

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

  it("fetches data from multiple tables as program objects", async () => {
    const foundPrograms = await dataClient.findAllPrograms();
    expect(foundPrograms.length).toEqual(5);
    expect(foundPrograms).toContainEqual({
      id: 1,
      name: "Tree Identification Class",
      totalCost: 3035,
      percentEmployed: 0,
      status: Status.APPROVED,
      provider: {
        id: "123",
        city: "Vineland",
        name: "Vineland Public Schools Adult Education Program",
        status: Status.SUSPENDED,
      },
    });
  });

  it("searches program ids when title, description matches a search query", async () => {
    const foundPrograms = await dataClient.search("tree");
    expect(foundPrograms).toEqual(expect.arrayContaining([1, 2, 5]));
  });

  it("finds programs by list of ids", async () => {
    const foundPrograms = await dataClient.findProgramsByIds(["1", "4"]);
    expect(foundPrograms.map((it) => it.name)).toEqual(
      expect.arrayContaining(["Tree Identification Class", "Mushroom Foraging Certification"])
    );
  });

  it("returns empty when id list is empty", async () => {
    const foundPrograms = await dataClient.findProgramsByIds([]);
    expect(foundPrograms).toHaveLength(0);
  });

  afterAll(async () => {
    dataClient.disconnect();
    await cmd("psql -c 'drop database d4adtest;' -U postgres -h localhost -p 5432");
  });
});
