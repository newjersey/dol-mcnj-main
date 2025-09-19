# Database migrations

Training Explorer has data coming from different sources (see [`data_model`](https://github.com/newjersey/d4ad/blob/master/data_model.md)), which may involve updating our Postgres databases. If you are doing a migration for the ETPL data, then see [this guide](https://github.com/newjersey/d4ad/blob/master/etpl_table_seed_guide.md) instead.

## Adding DB migrations

```shell script
npm --prefix=backend run db-migrate create [migration-name] -- --sql-file
```

## Seeding

When you want to add a DB migration that is a **seed** operation (that is, inserting data from a CSV), there's a specific process for this:

- make sure that the CSV source file is in the `backend/data` directory
- ensure that it does not have any leading/trailing newlines
- run the above DB migrate command to create the migration scripts in `backend/migrations`.
  I recommend the name to be "seed-[description]"
- run the `csvInserter` script to populate the migration file with insert statements generated from the CSV:

```shell script
node backend/data/csvInserter.js csvFilename.csv tablenameToInsertInto backend/migrations/sqls/seed-migration-name.sql
```

Assuming that you want a different seed for testing vs real life, then:

- create a CSV in `/backend/data` with matching structure, and test data
- duplicate the `.sql` migration file and rename it to end with `-TEST.sql`
- run the same node command above, with the test CSV filename and the test sql migration filename
- edit the corresponding `.js` file for the migration by replacing this line:

```javascript
exports.up/down = function(db) {
  var filePath = path.join(__dirname, 'sqls', 'filename.sql');
```

with this instead:

```javascript
exports.up/down = function(db) {
  const fileName = process.env.NODE_ENV === 'test' ? 'filename-TEST.sql' : 'filename.sql';
  var filePath = path.join(__dirname, 'sqls', fileName);
```

**Troubleshooting**

- If you are trying to run the tests and get an error that looks like:
  `RangeError [ERR_CHILD_PROCESS_STDIO_MAXBUFFER]: stdout maxBuffer length exceeded`, this implies that it is running
  the real migrations, not the test migrations, and that you forgot to add the `.js` modification above.
- If you are trying to run a migration and get an error that looks like:
  `ifError got unwanted exception: INSERT has more target columns than expressions`, this implies that there was an
  empty line at the end of your CSV, so your migration full of insert statements has a broken INSERT with `null` in it at the end.
  Remove this from the CSV and the migration, and it should work.

## Updating Seeds

When you want to add a DB migration that is a **seed update** operation (that is, replacing data
in a table new fresher data from a CSV), here is what to do:

> **IMPORTANT:** if we're updating the `etpl` table, follow the [ETPL table seed guide](https://github.com/newjersey/d4ad/blob/master/etpl_table_seed_guide.md) instead.

1. Create a database migration using the same script as [above](d4ad#adding-db-migrations) in the root `d4ad` folder. Use the `update-*` pattern for the migration name. For example, for the `etpl` table, you would run `npm --prefix=backend run db-migrate create update-etpl -- --sql-file`. This will automatically create the up and down SQL files and the JS file, all prefixed with a timestamp.
2. Make sure that both the OLD (previous) CSV and also the NEW (about-to-be-inserted) CSV are in the `backend/data` folder.
3. Run the following script to find the changed rows between old and new, and then delete and re-insert only those rows. This script will fill the generated SQL files with the SQL commands that do this. In the script, update `oldFilename`, `newFilename`, `tablenameToInsertInto`, `upFileName`, `downFileName` accordingly.

```shell script
./backend/data/create_update_migrations.sh oldFilename.csv newFilename.csv tablenameToInsertInto backend/migrations/sqls/upFileName.sql backend/migrations/sqls/downFileName.sql
```

4. We need to make sure the test migrations are accurate. Create new up and down files with the same name but with the `-TEST.sql` added.

- If your operation is just an update, leave a comment in BOTH files for "intentionally left blank"
- If your operation adds new columns, your down file should be "intentionally left blank" but your up file should delete from and re-insert the newly restructured test data.

5. As mentioned in the "Seeding" section above, modify the `.js` file for the migration to conditionally load the `-TEST.sql` up and down files.

6. Add, commit, and push the requisite files (up and down SQL files, the up and down TEST SQL files, the updated JS migration file, and the updated CSV file). The continuous deployment will automatically run the script that finds this new migration and executes it, thus updating the Postgres database with the commands outlined in the migrations.
