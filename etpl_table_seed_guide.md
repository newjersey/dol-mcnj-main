# Seeding the ETPL Table

This document contains steps for updating the data in the `etpl` database table. This requires a separate document
because it requires multiple steps for standardizing the data, inserting it, and updating search token data.

## Prerequisites

You will need the following:

- Terminal
- Python version 3.7 installed
- `pipenv` package installed

## Get CSVs and Clean Programs

1. Download the latest programs and providers CSVs and name them as `oldPrograms.csv` and `oldProviders.csv`, respectively.
2. In Terminal, in the `d4ad` root folder, run the commands below.
   > _Context:_ This formats the file names to the `*_yyyymmdd.csv` and moves them to the `backend/data` folder.

```shell script
date=$(date '+%Y%m%d')
mv oldPrograms.csv "backend/data/programs_${date}.csv"
mv oldProviders.csv "backend/data/providers_${date}.csv"
```

3. In the same `d4ad` folder, run the commands below. You may see a warning in the output, that's okay!
   > _Context_: This creates the `programs_yyyymmdd_merged.csv` file, with `DEGREEAWARDEDNAME`, `LICENSEAWARDEDNAME`, and `INDUSTRYCREDENTIALNAME` columns added and `SUBMITTERNAME` and `SUBMITTERTITLE` removed (private data).

```shell script
cd backend/data/program-credentials
pip3 install -r requirements.txt
python3 merge-credentials.py $date
```

4. Open the `programs_yyyymmdd_merged.csv` file in your IDE. Delete any empty lines at the bottom of the file.

## Combine Programs and Providers

5. In the same `program-credentials` folder, run the commands below. If you are asked for a Postgres password, include the one you made for the user `postgres` when setting up the app. You may get an error that "the etplcombination table doesn't exist", that's okay!
   > _Context_: This adds the `_old` suffix to the standardized CSV file to make way for the new one, and creates the `combined_etpl_raw.csv` file.

```shell script
cd ..
mv standardized_etpl.csv standardized_etpl_old.csv
./combine-etpl.sh "programs_${date}_merged.csv" "providers_${date}.csv"
```

## Standardize Combined Data

6. In the same `backend/data` folder, run the commands below.
   > _Context_: This will create the new `standardized_etpl.csv` and put it in the same folder.

```shell script
./run-standardization.sh
```

  6.1 [Optional] To support the data migration to Credential Engine, we also need to create a modified form of `standardized_etpl.csv` that does not contain linefeed characters within the rows of the CSV file (This is a limitation in the import process to the system consumming this content for the data migration). To support this, we run an additional script to create `standardized_etpl_for_data_migration.csv`

```shell script
python3 transform-for-migration.py
```

## Create migrations to update Postgres DB

To learn more about database migrations and seed updates, see the README.

7. In the same `backend/data` folder, run the commands below.
   > _Context_: This uses the DBMigrate library to create the migration files (up and down SQL, JS), all prefixed with the current timestamp.

```shell script
cd ../..
npm --prefix=backend run db-migrate create update-etpl -- --sql-file
```

8. In the same `d4ad` folder, run the command below. Be sure to change the UP and DOWN file names to what was created in the previous step.
   > _Context_: This will delete all rows from the current ETPL table and insert new rows from the latest CSV file, essentially overwriting it with new data. After running, you should see the UP and DOWN files now have thousands of lines of INSERT statements. It should also have the `programtokens` SQL statements added at the end of both files. This SQL will ensure that the tokens being searched on are up-to-date with etpl table changes. Please see [`decision_log.md #2020-08-12`](https://github.com/newjersey/d4ad/blob/master/decision_log.md#2020-08-12) for explanation of why we need this.

```shell script
./backend/data/create_update_etpl_migrations.sh standardized_etpl_old.csv standardized_etpl.csv backend/migrations/sqls/INSERT-UP-FILENAME.sql backend/migrations/sqls/INSERT-DOWN-FILENAME.sql
```

9. Create new up and down files with the same names but with the `-TEST.sql` suffix instead.
    10.1. If your operation is just an update, add the following comment `-- intentionally left blank` to both files.
    10.2. If your operation adds new columns, your DOWN file should have `-- intentionally left blank` but your UP file should have SQL code. Do this by first making a copy of `standardized_etpl_test.csv` and naming it `standardized_etpl_old_test.csv`. Then, add your new column(s) to the `standardized_etpl_test.csv` file in Excel and fill with dummy data. Finally, run the same script in Step 9 above with the test CSV and SQL files.

10. Modify the migration `.js` file to conditionally load the `-TEST.sql` up and down files. Follow the instructions in the README section starting with "edit the corresponding `.js` file..." to see what code to replace.
11. Delete the files that you will not need to push to Github. Run the following command in the `backend/data` folder.

```shell script
rm standardized_etpl_old.csv && rm "programs_${date}.csv" && rm "providers_${date}.csv" && rm "programs_${date}_merged.csv"
```

## Transform ETPL Data for Career Navigator

In this section, we will transform the ETPL data required for Career Navigator, rename the output, and upload it to the `nj-prod-re-data` S3 bucket.

1. **Navigate to the `transform-for-career-navigator` directory** inside the backend data folder:
   ```bash
   cd backend/data/transform-for-career-navigator
   ```

2. **Create a Python virtual environment** to isolate dependencies (optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install the Python dependencies** needed for this script by running:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the `transform-for-career-navigator.py` script** to generate the CSV file:
   ```bash
   python transform-for-career-navigator.py
   ```


   This will process the ETPL data into the format required for Career Navigator. Once complete, an output file will be generated in the same directory.

5. **Rename the output file** to `training.csv`:
   ```bash
   mv output_filename.csv training.csv
   ```


   *(Note: Replace `output_filename.csv` with the actual name of the file generated by the script.)*

6. **Upload the `training.csv` file** to the `nj-prod-re-data` S3 bucket manually using AWS CLI:

    - First, ensure that the AWS CLI is installed and configured on your machine. If it’s not configured yet, use:
      ```bash
      aws configure
      ```

      Enter your AWS Access Key ID, Secret Access Key, default region name, and output format.

    - Once the AWS CLI is configured, **upload the file**:
      ```bash
      aws s3 cp training.csv s3://nj-prod-re-data/
      ```

7. **Verify the upload** by listing the contents of the bucket:
   ```bash
   aws s3 ls s3://nj-prod-re-data/
   ```

You have now successfully transformed the ETPL data for Career Navigator and uploaded it to the production S3 bucket.

## Update the `programtokens` DB

1. If your operation adds new columns, also add this to the TEST up-file.

```postgresql
delete from programtokens;

insert into programtokens(programid, tokens)
select etpl.programid,
       to_tsvector(coalesce(etpl.standardized_name, etpl.officialname)) ||
       to_tsvector(coalesce(etpl.standardized_description, etpl.description, '')) ||
       to_tsvector(coalesce((string_agg(soccipcrosswalk.soc2018title, ' ')), ''))
from etpl
         left outer join soccipcrosswalk
                         on etpl.cipcode = soccipcrosswalk.cipcode
group by etpl.programid;
```

## Test the Changes

1. Finally, run the automated tests in the `d4ad` folder with the command below.

```shell script
./scripts/test-all.sh && ./scripts/build.sh && ./scripts/feature-tests.sh
```

> **Troubleshooting 1**: If you get the error about a Postgres password not being of the right type, you may need to change your Postgres user permissions. This involves finding the `pg_hba.conf` file on your computer, opening it in your Terminal via Vim editor, and changing all the permissions to `trust` instead of `sha_...`.

> **Troubleshooting 2**: If Cypress feature tests fail, you likely need to just change some of the data that we are looking for in the Training Explorer. Check the video for what data is showing in these instances, and update the test to check for that same data. You'll see examples of this in past commits to update data.

2. Add, commit, and push the requisite files (up and down SQL files, the up and down TEST SQL files, the updated JS migration file, and the updated CSV file). The continuous deployment will automatically run the script that finds this new migration and executes it, thus updating the Postgres database with the commands outlined in the migrations.
