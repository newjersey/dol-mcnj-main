# Seeding the ETPL Table

This document contains steps for updating the data in the `etpl` database table. This requires a separate document
because it requires multiple steps for standardizing the data, inserting it, and updating search token data.

## Prerequisites

You will need the following:

- Terminal
- Python version 3.7 installed
- `pipenv` package installed

## Get CSVs and Clean Programs

1. Download the latest programs and providers CSVs from NJTOPPS (the POC from NJ DOL will send them to you). Rename them as `oldPrograms.csv` and `oldProviders.csv`.
2. In Terminal, in the `d4ad` root folder, run the commands below.
   _Context:_ It will name the files to the `programs_yyyymmdd.csv` and `providers_yyyymmdd.csv` formats and move them to the `backend/data folder`.

```shell script
date=$(date '+%Y%m%d')
mv oldPrograms.csv "backend/data/programs_${date}.csv"
mv oldProviders.csv "backend/data/providers_${date}.csv"
```

3. In the same `d4ad` folder, run the following commands.
   _Context_: It will create the `programs_yyyymmdd_merged.csv` file, with `DEGREEAWARDEDNAME`, `LICENSEAWARDEDNAME`, and `INDUSTRYCREDENTIALNAME` columns added and `SUBMITTERNAME` and `SUBMITTERTITLE` removed (private data). You may see a warning in the output, that's okay!

```shell script
cd backend/data/program-credentials
python3 merge-credentials.py $date
```

4. Open the `programs_yyyymmdd_merged.csv` file in Excel. Hit Save.
   _Context_: Sometimes, integer values may appear as decimals in the CSV. This will make them integers again, preventing an error in the combine step.

5. Open the `programs_yyyymmdd_merged.csv` file in your IDE. Scroll to the bottom of the file. If you see any new empty lines, delete them so that the last line is data.

## Combine Programs and Providers

6. In the same `program-credentials` folder, run the script below.
   _Context_: This adds the `_old` suffix to the standardized CSV file to make way for the new one, and generates `combined_etpl_raw.csv` in the same `backend/data` folder.

> If you are asked for a Postgres password, include the one you made for the user `postgres` when setting up the app. You may get an error that "the etplcombination table doesn't exist", that's okay!

```shell script
cd ..
mv standardized_etpl.csv standardized_etpl_old.csv
./combine-etpl.sh "programs_${date}_merged.csv" "providers_${date}.csv"
```

## Standardize Combined Data

7. In `backend/data`, run the following script.
   _Context_: This will create the new `standardized_etpl.csv` and put it in the same folder.

```shell script
./run-standardization.sh
```

## Create migrations to update Postgres DB

8. Follow the [README instructions](https://github.com/newjersey/d4ad/blob/master/README.md#updating-seeds) to create a new migration for the update operation. The tablename is `etpl`. Use the `standardized_etpl.csv` as the "new" file, and `standardized_etpl_old.csv` as the "old" file.
9. After this step, delete the files that you will not need to push to Github. Run the following command in the `backend/data` folder.

```shell script
rm standardized_etpl_old.csv && rm "programs_${date}.csv" && rm "providers_${date}.csv" && rm "programs_${date}_merged.csv"
```

## Update the `programtokens` DB

10. **Important**: At the END of BOTH the up-file AND the down-file, we must delete all rows from the `programtokens` table and re-create it by adding the following code. This will ensure that the tokens being searched on are up-to-date with etpl table changes. Please see [`decision_log.md #2020-08-12`](https://github.com/newjersey/d4ad/blob/master/decision_log.md#2020-08-12) for explanation of why we need this. If your operation adds new columns, also add this to the TEST up-file.

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

11. Go back to the [README](https://github.com/newjersey/d4ad#updating-seeds) and finish with Step 7.
