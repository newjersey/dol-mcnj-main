ALTER TABLE etpl
    DROP COLUMN standardized_name,
    DROP COLUMN standardized_name_1,
    DROP COLUMN standardized_description,
    DROP COLUMN standardized_featuresdescription,
    DROP COLUMN mentions_wioa,
    DROP COLUMN default_job_search_duration,
    DROP COLUMN mentioned_job_search_duration;

ALTER TABLE etpl
    RENAME COLUMN name TO providername;

ALTER TABLE etpl DROP CONSTRAINT etpl_pkey;