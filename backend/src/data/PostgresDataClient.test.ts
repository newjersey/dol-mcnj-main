import { PostgresDataClient } from "./PostgresDataClient";
import util from "util";
import { exec } from "child_process";

const cmd = util.promisify(exec);

describe("PostgresDataClient", () => {
  let dataClient: PostgresDataClient;

  beforeAll(async () => {
    await cmd(
      "psql -c 'create database d4adtest;' -U postgres -h localhost -p 5432"
    );
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

  it("fetches data as program objects", async () => {
    const foundPrograms = await dataClient.findAllPrograms();
    expect(foundPrograms).toEqual([
      {
        name: "Tree Identification Class",
        totalCost: 3035,
        percentEmployed: 0,
      },
      {
        name: "Edible Leaves 101",
        totalCost: 1235.2,
        percentEmployed: 0.661016949152542,
      },
      {
        name: "Mushroom Foraging Certification",
        totalCost: 45,
        percentEmployed: null,
      },
      {
        name: "Program With No Outcomes",
        totalCost: 100.0,
        percentEmployed: null,
      },
    ]);
  });

  afterAll(async () => {
    dataClient.disconnect();
    await cmd(
      "psql -c 'drop database d4adtest;' -U postgres -h localhost -p 5432"
    );
  });
});
