# Seeding the ETPL Table

This document contains steps for updating the data in the `etpl` database table.  This requires a separate document
because it requires multiple steps for standardizing the data, inserting it, and updating search token data.

The process, at a high level:

1. [Combine](#combine-the-csv-files) the `programs_yyyymmdd.csv` and `providers_yyyymmdd.csv` files into a single combined csv
2. [Standardize](#standardize-using-python-scripts) the data using the python data-standardization repo
3. [Insert](#insert-the-data) the data into the database migration
4. [Update](#update-the-programtokens) the program tokens within the migration

## Combine the CSV files

Make sure the newest `programs_yyyymmdd.csv` and `providers_yyyymmdd.csv` are in the `backend/data` folder.

Execute the combiner script as follows:

```shell script
cd backend/data
./combine-etpl.sh programs_yyyymmdd.csv providers_yyyymmdd.csv
```

This generates `combined_etpl_raw.csv` in the same `backend/data` folder.

## Standardize using python scripts

Make sure `pipenv` and `python3` are installed on the machine.

Run the standardizer script (still in the `/backend/data` folder) as follows:
```shell script
./run-standardization.sh
```

This will create the `standardized_etpl.csv` and put it in the `/backend/data` folder

## Insert the data 

Follow the [README instructions](https://github.com/newjersey/d4ad/blob/master/README.md#updating-seeds) to create
a new migration for the update operation.  The tablename is `etpl`.  

Remember to include the `delete from` statement at the top.
Use the `standardized_etpl.csv` to create insert statements.

## Update the `programtokens`

This is **IMPORTANT** when updating the ETPL table.

At the END of BOTH the up-file AND the down-file, we must delete all rows from the `programtokens` table
and re-create it by adding the following code:

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

This will ensure that the tokens being searched on are up-to-date with etpl table changes.
Please see [`decision_log.md #2020-08-12`](https://github.com/newjersey/d4ad/blob/master/decision_log.md#2020-08-12) for explanation of why we need this.