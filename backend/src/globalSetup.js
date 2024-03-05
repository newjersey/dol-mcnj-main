const util = require("util");
const { exec: execCallback } = require("child_process");

// Enhance the cmd function to accept options, including a custom maxBuffer size
const cmd = (command, options = {}) => {
  const execPromisified = util.promisify(execCallback);
  return execPromisified(command, { maxBuffer: 1024 * 5000, ...options }); // Default to 5 MB buffer, override with options if provided
};

module.exports = async () => {
  try {
    console.log("Creating database 'd4adtest'...");
    await cmd("psql -c 'create database d4adtest;' -U postgres -h localhost -p 5432");
    console.log("Database created successfully.");

    console.log("Running database migrations...");
    // For commands that typically produce a lot of output, you can increase the maxBuffer size as needed
    await cmd("npm run db-migrate up -- -e test", { maxBuffer: 1024 * 10000 }); // Example: Increasing buffer to 10 MB for db-migrate
    console.log("Database migrations applied successfully.");
  } catch (error) {
    console.error("Error during global setup:", error);
    throw error; // Rethrow the error to ensure Jest is aware that the global setup failed
  }
};
