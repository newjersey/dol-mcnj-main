ALTER TABLE programtokens DROP CONSTRAINT programtokens_pkey;
ALTER TABLE programtokens ADD COLUMN programid CHARACTER VARYING(8);
UPDATE programtokens set programid = programs.programid from programs where programtokens.id = programs.id;
ALTER TABLE programtokens DROP COLUMN id;
ALTER TABLE programtokens ADD PRIMARY KEY (programid);

ALTER TABLE programs DROP CONSTRAINT programs_pkey;
ALTER TABLE programs ADD PRIMARY KEY (programid);
ALTER TABLE programs drop column id;