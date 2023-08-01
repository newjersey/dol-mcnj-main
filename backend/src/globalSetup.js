const util = require("util");
const {exec} = require("child_process");
const cmd = util.promisify(exec);

module.exports = async () => {
  await cmd("psql -c 'create database d4adtest;' -U postgres -h localhost -p 5432");
  await cmd("npm run db-migrate up -- -e test");
};
