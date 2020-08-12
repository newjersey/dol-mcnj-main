ALTER TABLE programs DROP CONSTRAINT programs_pkey;
ALTER TABLE programs ADD COLUMN id SERIAL PRIMARY KEY ;
UPDATE programtokens set id = programs.id from programs where programtokens.id = programs.programid;
