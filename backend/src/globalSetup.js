const util = require("util");
const { exec } = require("child_process");
const cmd = util.promisify(exec);

module.exports = async () => {
  try {
    console.log("Creating database 'd4adtest'...");
    const createDbResult = await cmd("psql -c 'create database d4adtest;' -U postgres -h localhost -p 5432", { maxBuffer: 1024 * 5000 }); // Increase maxBuffer to 5MB
    console.log("Database created successfully. Output:", createDbResult.stdout);

    console.log("Running database migrations...");
    const migrateResult = await cmd("npm run db-migrate up -- -e test", { maxBuffer: 1024 * 5000 }); // Same increase for migrations
    console.log("Database migrations applied successfully. Output:", migrateResult.stdout);
  } catch (error) {
    console.error("Error during global setup:", error);
    throw error; // Rethrow the error to ensure Jest is aware that the global setup failed
  }
};
