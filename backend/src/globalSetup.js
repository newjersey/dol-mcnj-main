const { spawn } = require("child_process");

module.exports = async () => {
  try {
    console.log("Checking database connection before setup...");
    await executeCommand("psql", ["-c", "SELECT 1;", "-U", "postgres", "-h", "localhost", "-p", "5432"]);
    console.log("✅ Database connection successful.");

    console.log("Creating database 'd4adtest'...");
    await executeCommand("psql", ["-c", "CREATE DATABASE d4adtest;", "-U", "postgres", "-h", "localhost", "-p", "5432"]);
    console.log("✅ Database created successfully.");

    console.log("Running database migrations...");

    const migrationTimeout = 15 * 60 * 1000; // 15 minutes timeout
    const migrationPromise = executeCommand("npm", ["run", "db-migrate", "up", "--", "-e", "test"], false);

    await Promise.race([
      migrationPromise,
      new Promise((_, reject) =>
          setTimeout(() => reject(new Error("❌ Database migration timeout exceeded")), migrationTimeout)
      ),
    ]);

    console.log("✅ Database migrations applied successfully.");
  } catch (error) {
    console.error("❌ Error during global setup:", error);
    throw error; // Ensure Jest knows the setup failed
  }
};

function executeCommand(command, args = [], silent = false) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args);

    // Stream logs to Jest in real-time to avoid CI timeouts
    proc.stdout.on("data", (data) => {
      console.log(`[${command}]: ${data.toString().trim()}`);
    });

    proc.stderr.on("data", (data) => {
      console.error(`[${command} ERROR]: ${data.toString().trim()}`);
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`❌ Command "${command}" exited with code ${code}`));
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`❌ Failed to start process "${command}": ${err.message}`));
    });
  });
}
