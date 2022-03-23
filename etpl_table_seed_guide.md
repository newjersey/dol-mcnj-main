# Seeding the ETPL Table

This document contains steps for updating the data in the `etpl` database table. This requires a separate document
because it requires multiple steps for standardizing the data, inserting it, and updating search token data.

The process, at a high level:

1. [Add](#add-credential-names) credential column names to `programs_yyyymmdd.csv`
2. [Combine](#combine-the-csv-files) the `programs_yyyymmdd.csv` and `providers_yyyymmdd.csv` files into a single combined csv
3. [Standardize](#standardize-using-python-scripts) the data using the python data-standardization repo
4. [Insert](#insert-the-data) the data into the database migration
5. [Update](#update-the-programtokens) the program tokens within the migration

## Add Credential Names

1. Make sure you have Python (version 3) installed.
1. Download the programs and providers CSVs
1. Rename the files to the `programs_yyyymmdd.csv` and `providers_yyyymmdd.csv` formats.
1. Put the files in the `backend/data` folder.
1. In the `programs`, delete the `SUBMITTERNAME` and `SUBMITTERTITLE` columns. These are private data that should not be part of our repo.
1. Move to the program credentials folder:

```shell script
cd backend/data/program-credentials
```

6. Open `merge-credentials.py` in your IDE and update the following lines (36 & 41) with the correct `programs_yyyymmdd.csv` filename:

```
df.to_csv('../programs_yyyymmdd_merged.csv', index=False)
```

```
from_filepath = "../programs_yyyymmdd.csv"
```

7. Execute the following script to add the `DEGREEAWARDEDNAME`, `LICENSEAWARDEDNAME`, and `INDUSTRYCREDENTIALNAME` columns
   to programs `programs_yyyymmdd.csv`.

```shell script
python3 merge-credentials.py programs_yyyymmdd.csv
```

8. Confirm this change before moving to the next step. Also, remove (if any) trailing whitespace at end of file.

9. Open `programs_yyyymmdd_merged.csv` in your IDE. If integer values appear as decimals, open file in Excel and hit save. The numbers will appear as integers again. If you do not do this, you will get an error in the next step with decimal numbers in the message.

## Combine the CSV files

1. Execute the combiner script as follows. This moves back to the `backend/data` folder, adds the `_old` suffix to the CSV file to make way for the new one, and generates `combined_etpl_raw.csv` in the same `backend/data` folder.

```shell script
cd ..
mv standardized_etpl.csv standardized_etpl_old.csv
./combine-etpl.sh programs_yyyymmdd_merged.csv providers_yyyymmdd.csv
```

## Standardize using python scripts

1. Make sure `pipenv` is installed on the machine.
2. In `backend/data`, run the standardizer script. This will create the new `standardized_etpl.csv` and put it in the same folder.

```shell script
./run-standardization.sh
```

## Insert the data

1. Follow the [README instructions](https://github.com/newjersey/d4ad/blob/master/README.md#updating-seeds) to create a new migration for the update operation. The tablename is `etpl`. Use the `standardized_etpl.csv` as the "new" file, and `standardized_etpl_old.csv` as the "old" file.
2. After this step, delete the `standardized_etpl_old.csv`, `programs_yyyymmdd.csv`, `providers_yyyymmdd.csv`, `combined_etpl_raw.csv`, `programs_yyyymmdd_merged.csv` files. You no longer need them and don't need to push them to Github.

## Update the `programtokens`

This is **IMPORTANT** when updating the ETPL table.

1. At the END of BOTH the up-file AND the down-file, we must delete all rows from the `programtokens` table and re-create it by adding the following code. This will ensure that the tokens being searched on are up-to-date with etpl table changes. Please see [`decision_log.md #2020-08-12`](https://github.com/newjersey/d4ad/blob/master/decision_log.md#2020-08-12) for explanation of why we need this.

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
