const { spawn } = require('child_process');

module.exports = async () => {
  try {
    console.log("Creating database 'd4adtest'...");
    await executeCommand('psql', ['-c', 'create database d4adtest;', '-U', 'postgres', '-h', 'localhost', '-p', '5432']);
    console.log("Database created successfully.");

    console.log("Running database migrations...");
    await executeCommand('npm', ['run', 'db-migrate', 'up', '--', '-e', 'test']); // Added a third parameter to indicate silent execution
    console.log("Database migrations applied successfully.");
  } catch (error) {
    console.error("Error during global setup:", error);
    throw error; // Rethrow the error to ensure Jest is aware that the global setup failed
  }
};

function executeCommand(command, args = [], silent = false) {
  return new Promise((resolve, reject) => {
    const stdioOption = silent ? 'ignore' : 'inherit';
    const proc = spawn(command, args, { stdio: stdioOption });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${command}" exited with code ${code}`));
      }
    });
  });
}
