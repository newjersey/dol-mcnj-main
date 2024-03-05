const util = require("util");
const { exec: execCallback } = require("child_process");
const exec = util.promisify((command) => execCallback(command, { maxBuffer: 1024 * 5000 })); // Increase maxBuffer to 5MB

module.exports = async () => {
  try {
    console.log("Creating database 'd4adtest'...");
    const createDbResult = await exec("psql -c 'create database d4adtest;' -U postgres -h localhost -p 5432");
    console.log("Database created successfully. Output:", createDbResult.stdout);

    console.log("Running database migrations...");
    const migrateResult = await exec("npm run db-migrate up -- -e test");
    console.log("Database migrations applied successfully. Output:", migrateResult.stdout);
  } catch (error) {
    console.error("Error during global setup:", error);
    throw error; // Rethrow the error to ensure Jest is aware that the global setup failed
  }
};
