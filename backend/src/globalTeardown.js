const util = require("util");
const {exec} = require("child_process");
const cmd = util.promisify(exec);

module.exports = async () => {
  console.log("🧹 Starting global teardown...");
  await cmd("psql -c 'drop database d4adtest;' -U postgres -h localhost -p 5432");
  console.log("✅ Global teardown complete.");
  setTimeout(() => {
    console.log("Forcefully exiting process...");
    process.exit(0);
  }, 1000);
}
