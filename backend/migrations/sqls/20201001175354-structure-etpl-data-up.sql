ALTER TABLE etpl
    ADD COLUMN google_direction_url text,
    ADD COLUMN mention_hybrid boolean,
    ADD COLUMN mention_inperson boolean,
    ADD COLUMN mention_remote boolean,
    ADD COLUMN commented_suspended_program_status boolean,
    ADD COLUMN standardized_nongovapproval text;/* Replace with your SQL commands */