const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

// expected args:
// - csv filename OLD
// - csv filename NEW
// - table name
// - outfile path
const args = process.argv.splice(2);
const csvFilenameOld = args[0];
const csvFilenameNew = args[1];
const tableName = args[2];
const outfilePath = args[3];

console.log(path.join(__dirname,  csvFilenameOld))

fs.readFile( path.join(__dirname,  csvFilenameOld), function (err, fileContentsOld) {
  if (err) {
    throw err;
  }

  fs.readFile( path.join(__dirname,  csvFilenameNew), function (err, fileContentsNew) {
    if (err) {
      throw err;
    }

    let output = '';

    fileContentsOld = fileContentsOld.toString().replace(`'`, `"`);
    fileContentsNew = fileContentsNew.toString().replace(`'`, `"`);
    const dataOld = Papa.parse(fileContentsOld, {header: true}).data;
    const dataNew = Papa.parse(fileContentsNew, {header: true}).data;

    const columnsOld = Object.keys(dataOld[0]);
    const columnsNew = Object.keys(dataOld[0]);

    dataOld.forEach((row) => {
      if (Object.values(row).length === columnsOld.length) {

        const values = Object.values(row).map(columnValue => {
          columnValue = columnValue.replace(/'/g, "''");
          if (columnValue === '') {
            return 'null';
          }
          return `'${columnValue}'`;
        });

        const selectors = values.map((value, index) => {
          const correspondingColumn = columnsOld[index];
          return `${correspondingColumn} = ${value}`
        })

        output += `DELETE FROM ${tableName} WHERE ${selectors.join(' AND ')};\n`
      }
    });

    dataNew.forEach((row) => {
      if (Object.values(row).length === columnsNew.length) {
        const values = Object.values(row).map(columnValue => {
          columnValue = columnValue.replace(/'/g, "''");
          if (columnValue === '') {
            return 'null';
          }
          return `'${columnValue}'`;
        });

        output += `INSERT INTO ${tableName} (${columnsNew.join(',')}) values (${values.join(',')});\n`
      }
    });

    fs.writeFile(outfilePath, output, (err) => {
      if (err) throw err;
    })
  });
});
