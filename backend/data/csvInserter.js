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
  console.error('Usage: node csvInserter.js <csvFilename> <tableName> <outfilePath>');
  process.exit(1);
}

// Set of values to standardize as SQL NULL
const nullValues = new Set(['', 'NA', 'Unknown', 'untitled', null, undefined]);

// List of columns that should be numeric (unquoted in SQL)
const numericColumns = new Set([
  'exiters', 'completers', 'n_employed_q2', 'employment_rate_q2',
  'n_employed_q4', 'employment_rate_q4', 'median_q2_annual', 'median_q4_annual',
  'completion_rate', 'credential_rate'
]);

// List of columns that should be date (add as needed)
// const dateColumns = new Set(['your_date_column']);

function sanitizeValue(col, value) {
  const cleanValue = typeof value === "string" ? value.trim() : value;
  if (nullValues.has(cleanValue)) return 'NULL';

  // Numeric columns
  if (numericColumns.has(col)) {
    // Remove commas, handle % if necessary
    let numValue = cleanValue.replace(/,/g, '');
    // If value ends with %, remove and convert to decimal if desired
    if (numValue.endsWith('%')) {
      numValue = numValue.slice(0, -1);
    }
    const num = Number(numValue);
    return isNaN(num) ? 'NULL' : num;
  }

  // // Date columns (example, uncomment and adjust if needed)
  // if (dateColumns.has(col)) {
  //   // Basic YYYY-MM-DD validation
  //   if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
  //     return `'${cleanValue}'`;
  //   }
  //   return 'NULL';
  // }

  // Default: string, escape single quotes
  return `'${String(cleanValue).replace(/'/g, "''")}'`;
}

fs.readFile(path.join(__dirname, csvFilename), function (err, fileContents) {
  if (err) {
    throw err;
  }

  let output = '';
  let skippedRows = [];

  const data = Papa.parse(fileContents.toString(), { header: true, skipEmptyLines: true }).data;

  // If there are no rows, just exit
  if (!data.length) {
    console.warn('CSV contains no data rows.');
    return;
  }

  const columns = Object.keys(data[0]).join(',');

  data.forEach((row, idx) => {
    // Skip completely empty rows
    if (
        Object.values(row).every(
            columnValue => nullValues.has(
                typeof columnValue === "string" ? columnValue.trim() : columnValue
            )
        )
    ) {
      skippedRows.push({ idx, reason: 'row is fully empty or placeholder' });
      return;
    }

    // Optionally, define required columns (e.g., program_id)
    // If you want to skip rows missing critical fields:
    // if (nullValues.has(row['program_id'])) {
    //   skippedRows.push({ idx, reason: 'missing required program_id' });
    //   return;
    // }

    const values = Object.entries(row).map(([col, value]) => sanitizeValue(col, value));
    output += `INSERT INTO ${tableName} (${columns}) VALUES (${values.join(',')});\n`;
  });

  // Write to temp file, then rename for atomicity
  const tempOutfile = outfilePath + '.tmp';
  fs.writeFile(tempOutfile, output, (err) => {
    if (err) throw err;
    fs.rename(tempOutfile, outfilePath, (err) => {
      if (err) throw err;
      console.log(`Output written to ${outfilePath}`);
      if (skippedRows.length) {
        console.warn(`Skipped ${skippedRows.length} rows. See skipped_rows.log for details.`);
        fs.writeFileSync('skipped_rows.log', JSON.stringify(skippedRows, null, 2));
      }
    });
  });
});