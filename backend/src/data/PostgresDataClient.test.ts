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
    expect(foundPrograms).toEqual([
      { id: 1, name: "Tree Identification Class", totalCost: 3035, percentEmployed: 0, provider: {id: '123', city : 'Vineland'}},
      { id: 2, name: "Edible Leaves 101", totalCost: 1235.2, percentEmployed: 0.661016949152542, provider: {id: '456', city : 'Treeland' }},
      { id: 3, name: "Mushroom Foraging Certification", totalCost: 45, percentEmployed: null, provider: {id: '789', city : 'Cumberland' }},
      { id: 4, name: "Program With No Outcomes", totalCost: 100.0, percentEmployed: null, provider: {id: '456', city : 'Treeland' }},
    ]);
  });

  it("searches for titles and descriptions containing a search query", async () => {
    const foundPrograms = await dataClient.searchPrograms("tree");
    expect(foundPrograms).toEqual([
      { id: 1, name: "Tree Identification Class", totalCost: 3035, percentEmployed: 0, provider: {id: '123', city : 'Vineland' }},
      { id: 4, name: "Program With No Outcomes", totalCost: 100.0, percentEmployed: null, provider: {id: '456', city: 'Treeland' }},
    ]);
  });

  afterAll(async () => {
    dataClient.disconnect();
    await cmd("psql -c 'drop database d4adtest;' -U postgres -h localhost -p 5432");
  });
});
