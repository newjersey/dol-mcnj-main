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

if (!csvFilename || !tableName || !outfilePath) {
  console.error(
      'Usage: node csvInserter.js <csvFilename> <tableName> <outfilePath>\n' +
      'Example: node csvInserter.js data.csv my_table output.sql'
  );
  process.exit(1);
}

// Set of values to standardize as SQL NULL (case-insensitive)
const nullValues = new Set(['', 'na', 'unknown', 'untitled', null, undefined]);

/**
 * Determines if a value should be treated as SQL NULL.
 * Accepts case-insensitive match and trims whitespace.
 */
function isNullValue(value) {
  if (typeof value !== 'string') {
    return value === null || value === undefined;
  }
  return nullValues.has(value.trim().toLowerCase());
}

/**
 * Sanitizes and formats a value for SQL insertion.
 * - Returns NULL for missing/placeholder values.
 * - For numbers, returns as unquoted if parseable.
 * - For others, escapes single quotes and wraps in single quotes.
 */
function sanitizeValue(value) {
  if (isNullValue(value)) return 'NULL';

  // Try to parse as a number (unquoted if valid and not empty string)
  const numValue = typeof value === 'string' ? value.replace(/,/g, '').trim() : value;
  if (
      numValue !== '' &&
      !isNaN(numValue) &&
      numValue !== null &&
      numValue !== undefined
  ) {
    return Number(numValue);
  }

  // Otherwise, escape single quotes and wrap in single quotes for SQL
  return `'${String(value).replace(/'/g, "''").trim()}'`;
}

fs.readFile(path.join(__dirname, csvFilename), function (err, fileContents) {
  if (err) {
    throw err;
  }

  let output = '';
  const data = Papa.parse(fileContents.toString(), { header: true, skipEmptyLines: true }).data;

  if (!data.length) {
    console.warn('CSV file is empty or has no data rows.');
    return;
  }

  const columns = Object.keys(data[0]).join(',');

  let skippedRows = 0;
  data.forEach((row, idx) => {
    // Skip rows that are entirely NULL/empty/placeholder
    const valuesArr = Object.values(row);
    const allNull = valuesArr.every(val => isNullValue(val));
    if (allNull) {
      skippedRows++;
      // Optionally log skipped row index
      // console.log(`Row ${idx + 1} skipped: all values NULL`);
      return;
    }

    const values = valuesArr.map(sanitizeValue);

    output += `INSERT INTO ${tableName} (${columns}) VALUES (${values.join(',')});\n`;
  });

  fs.writeFile(outfilePath + '.tmp', output, (err) => {
    if (err) throw err;
    // Atomic write: rename temp file to actual file
    fs.rename(outfilePath + '.tmp', outfilePath, (err) => {
      if (err) throw err;
      console.log(`SQL file written to ${outfilePath} (${data.length - skippedRows} rows, ${skippedRows} skipped)`);
    });
  });
});