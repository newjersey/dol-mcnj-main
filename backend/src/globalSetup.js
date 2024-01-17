const util = require("util");
const {exec: execCallback} = require("child_process");

const exec = util.promisify((cmd, options, callback) => execCallback(cmd, {...options, maxBuffer: 1024 * 5000}, callback)); // 5 MB buffer

module.exports = async () => {
  await exec("psql -c 'create database d4adtest;' -U postgres -h localhost -p 5432");
  await exec("npm run db-migrate up -- -e test");
};