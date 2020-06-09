import { PostgresDataClient } from "./PostgresDataClient";
import util from "util";
import { exec } from "child_process";

const cmd = util.promisify(exec);

describe("PostgresDataClient", () => {
  let dataClient: PostgresDataClient;

  beforeAll(async () => {
    await cmd("psql -c 'create database d4adtest;' -U postgres");
    await cmd("npm run db-migrate up -- -e test");
    await cmd(
      "CSV_FILENAME=program_test.csv DB_NAME=d4adtest ../scripts/db-seed.sh"
    );

    const connection = {
      user: "postgres",
      host: "localhost",
      database: "d4adtest",
      password: "",
      port: 5432,
    };
    dataClient = new PostgresDataClient(connection);
  });

  it("fetches data as a list of program titles", async () => {
    const foundPrograms = await dataClient.findAllPrograms();
    expect(foundPrograms).toEqual([
      "Tree Identification Class",
      "Edible Leaves 101",
    ]);
  });

  afterAll(async () => {
    dataClient.disconnect();
    await cmd("psql -c 'drop database d4adtest;' -U postgres");
  });
});
