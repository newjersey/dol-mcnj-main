const util = require("util");
const { exec } = require("child_process");
const cmd = util.promisify(exec);

module.exports = async () => {
  try {
    console.log("Creating database 'd4adtest'...");
    await cmd("psql -c 'create database d4adtest;' -U postgres -h localhost -p 5432");
    console.log("Database created successfully.");

    // Check if running in CI environment and skip migration if so
    if (!process.env.IS_CI) {
      console.log("Running database migrations...");
      await cmd("npm run db-migrate up -- -e test");
      console.log("Database migrations applied successfully.");
    } else {
      console.log("Skipping database migrations in CI environment.");
    }
  } catch (error) {
    console.error("Error during global setup:", error);
    throw error;
  }
};
