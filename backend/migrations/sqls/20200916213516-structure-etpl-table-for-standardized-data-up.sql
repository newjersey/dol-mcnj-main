ALTER TABLE etpl
    ADD COLUMN standardized_name text,
    ADD COLUMN standardized_name_1 text,
    ADD COLUMN standardized_description text,
    ADD COLUMN standardized_featuresdescription text,
    ADD COLUMN mentions_wioa character varying(32),
    ADD COLUMN default_job_search_duration character varying(32),
    ADD COLUMN mentioned_job_search_duration character varying(32);

ALTER TABLE etpl
    RENAME COLUMN providername TO name;

ALTER TABLE etpl ADD PRIMARY KEY (programid);