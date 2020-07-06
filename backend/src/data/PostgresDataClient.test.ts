import { PostgresDataClient } from "./PostgresDataClient";
import util from "util";
import { exec } from "child_process";

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
    expect(foundPrograms).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          name: "Tree Identification Class",
          totalCost: 3035,
          percentEmployed: 0,
          provider: { id: "123", city: "Vineland" },
        },
        {
          id: 2,
          name: "Tree Identification Class Level 2",
          totalCost: 3035,
          percentEmployed: 0,
          provider: { id: "123", city: "Vineland" },
        },
        {
          id: 3,
          name: "Edible Leaves 101",
          totalCost: 1235.2,
          percentEmployed: 0.661016949152542,
          provider: { id: "456", city: "Treeland" },
        },
        {
          id: 4,
          name: "Mushroom Foraging Certification",
          totalCost: 45,
          percentEmployed: null,
          provider: { id: "789", city: "Cumberland" },
        },
        {
          id: 5,
          name: "Program With No Outcomes",
          totalCost: 100.0,
          percentEmployed: null,
          provider: { id: "456", city: "Treeland" },
        },
      ])
    );
  });

  it("searches for titles and descriptions containing a search query", async () => {
    const foundPrograms = await dataClient.searchPrograms("tree");
    expect(foundPrograms).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          name: "Tree Identification Class",
          totalCost: 3035,
          percentEmployed: 0,
          provider: { id: "123", city: "Vineland" },
        },
        {
          id: 2,
          name: "Tree Identification Class Level 2",
          totalCost: 3035,
          percentEmployed: 0,
          provider: { id: "123", city: "Vineland" },
        },
        {
          id: 5,
          name: "Program With No Outcomes",
          totalCost: 100.0,
          percentEmployed: null,
          provider: { id: "456", city: "Treeland" },
        },
      ])
    );
  });

  it("searches for correctly-formatted CIP codes given a SOC keyword", async () => {
    const foundCips = await dataClient.searchCipsBySocKeyword("botanist");
    expect(foundCips).toEqual(["123456", "987654"]);
  });

  it("finds programs by list of CIP codes", async () => {
    const foundPrograms = await dataClient.findProgramsByCips(["123456", "987654"]);
    expect(foundPrograms).toHaveLength(3);
    expect(foundPrograms.map((it) => it.name)).toEqual(
      expect.arrayContaining([
        "Tree Identification Class",
        "Tree Identification Class Level 2",
        "Edible Leaves 101",
      ])
    );
  });

  it("returns empty when CIP code list is empty", async () => {
    const foundPrograms = await dataClient.findProgramsByCips([]);
    expect(foundPrograms).toHaveLength(0);
  });

  afterAll(async () => {
    dataClient.disconnect();
    await cmd("psql -c 'drop database d4adtest;' -U postgres -h localhost -p 5432");
  });
});
