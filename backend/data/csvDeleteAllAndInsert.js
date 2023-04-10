const fs = require("fs");
const Papa = require("papaparse");
const path = require("path");

// expected args:
// - csv filename
// - table name
// - outfile path
const args = process.argv.splice(2);
const csvFilename = args[0];
const tableName = args[1];
const outfilePath = args[2];

const file = fs.createReadStream(path.join(__dirname, csvFilename));

let output = `DELETE FROM ${tableName};\n`;

const PROGRAM_TOKENS_SQL_CODE = `\ndelete from programtokens;

insert into programtokens(programid, tokens)
select etpl.programid,
       to_tsvector(coalesce(etpl.officialname, etpl.officialname)) ||
       to_tsvector(coalesce(etpl.standardized_name_1, etpl.name)) ||
       to_tsvector(coalesce(etpl.standardized_description, etpl.description, '')) ||
       to_tsvector(coalesce((string_agg(soccipcrosswalk.soc2018title, ' ')), ''))
from etpl
         left outer join soccipcrosswalk
                         on etpl.cipcode = soccipcrosswalk.cipcode
group by etpl.programid;`;

Papa.parse(file, {
  worker: true,
  header: true,
  step: function (result) {
    const row = result.data;
    const columns = Object.keys(row).join(",");

    const values = Object.values(row).map((columnValue) => {
      columnValue = columnValue.replace(/'/g, "''");
      if (columnValue === "") {
        return "null";
      }
      return `'${columnValue}'`;
    });

    output += `INSERT INTO ${tableName} (${columns}) values (${values.join(",")});\n`;
  },
  complete: function (results, file) {
    output += PROGRAM_TOKENS_SQL_CODE;
    fs.writeFile(outfilePath, output, (err) => {
      if (err) throw err;
    });
  },
});
