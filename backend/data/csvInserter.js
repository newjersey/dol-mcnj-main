const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

// expected args:
// - csv filename
// - table name
// - outfile path
const args = process.argv.splice(2);
const csvFilename = args[0];
const tableName = args[1];
const outfilePath = args[2];

fs.readFile( path.join(__dirname,  csvFilename), function (err, fileContents) {
  if (err) {
    throw err;
  }

  let output = '';

  const data = Papa.parse(fileContents.toString(), { header: true }).data;

  const columns = Object.keys(data[0]).join(',');

  data.forEach((row) => {
    const values = Object.values(row).map(columnValue => {
      columnValue = columnValue.replace(/'/g, "''");
      if (columnValue === '') {
        return 'null';
      }
      return `'${columnValue}'`;
    });

    output += `INSERT INTO ${tableName} (${columns}) values (${values.join(',')});\n`
  });

  fs.writeFile(outfilePath, output, (err) => {
    if (err) throw err;
  })
});
