const util = require("util");
const {exec} = require("child_process");
const cmd = util.promisify(exec);

module.exports = async () => {
  await cmd("psql -c 'drop database d4adtest;' -U postgres -h localhost -p 5432");
}