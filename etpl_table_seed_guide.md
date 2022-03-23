# Seeding the ETPL Table

This document contains steps for updating the data in the `etpl` database table. This requires a separate document
because it requires multiple steps for standardizing the data, inserting it, and updating search token data.

The process, at a high level:

1. [Add](#add-credential-names) credential column names to `programs_yyyymmdd.csv`
2. [Combine](#combine-the-csv-files) the `programs_yyyymmdd.csv` and `providers_yyyymmdd.csv` files into a single combined csv
3. [Standardize](#standardize-using-python-scripts) the data using the python data-standardization repo
4. [Insert](#insert-the-data) the data into the database migration
5. [Update](#update-the-programtokens) the program tokens within the migration

## Prerequisites

You will need the following:

- Terminal
- Python version 3 installed
- `pipenv` package installed

## Get CSVs and Clean Programs

1. Download the programs and providers CSVs from NJTOPPS (the POC from NJ DOL will be able to send them to you)
2. Rename the files to the `programs_yyyymmdd.csv` and `providers_yyyymmdd.csv` formats, and move them to the `backend/data folder`. You can use the following script, assuming your CSV files are in the `d4ad` root folder.

```shell script
date=$(date '+%Y%m%d')
mv oldProgramsFileName.csv "backend/data/programs_${date}.csv"
mv oldProvidersFileName.csv "backend/data/providers_${date}.csv"
```

3. Move to the program credentials folder and execute the following script to add the `DEGREEAWARDEDNAME`, `LICENSEAWARDEDNAME`, and `INDUSTRYCREDENTIALNAME` columns
   to programs `programs_yyyymmdd.csv`. This also removes the `SUBMITTERNAME` and `SUBMITTERTITLE` columns from the resulting file, as it is private data that should not be part of the data we upload.

```shell script
cd backend/data/program-credentials
python3 merge-credentials.py $date
```

4. Confirm the changes in Step 3 before moving to the next step. Also, remove (if any) trailing whitespace at end of file.

5. Open `programs_yyyymmdd_merged.csv` in your IDE. If integer values appear as decimals, open file in Excel and hit save. The numbers will appear as integers again. If you do not do this, you will get an error in the next step with decimal numbers in the message.

## Combine Programs and Providers

6. Execute the combiner script as follows. This moves back to the `backend/data` folder, adds the `_old` suffix to the CSV file to make way for the new one, and generates `combined_etpl_raw.csv` in the same `backend/data` folder.

```shell script
cd ..
mv standardized_etpl.csv standardized_etpl_old.csv
./combine-etpl.sh "programs_${date}_merged.csv" "providers_${date}.csv"
```

## Standardize Combined Data

7. In `backend/data`, run the standardizer script. This will create the new `standardized_etpl.csv` and put it in the same folder.

```shell script
./run-standardization.sh
```

## Create migrations to update Postgres DB

8. Follow the [README instructions](https://github.com/newjersey/d4ad/blob/master/README.md#updating-seeds) to create a new migration for the update operation. The tablename is `etpl`. Use the `standardized_etpl.csv` as the "new" file, and `standardized_etpl_old.csv` as the "old" file.
9. After this step, delete the files that you will not need to push to Github. Run the following command in the `backend/data` folder.

```shell script
rm standardized_etpl_old.csv && rm "programs_${date}.csv" && rm "providers_${date}.csv" && rm combined_etpl_raw.csv && rm "programs_${date}_merged.csv"
```

## Update the `programtokens` DB

10. **Important**: At the END of BOTH the up-file AND the down-file, we must delete all rows from the `programtokens` table and re-create it by adding the following code. This will ensure that the tokens being searched on are up-to-date with etpl table changes. Please see [`decision_log.md #2020-08-12`](https://github.com/newjersey/d4ad/blob/master/decision_log.md#2020-08-12) for explanation of why we need this.

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
