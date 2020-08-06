alter table localexceptioncips add column cipcode character varying(16);
update localexceptioncips set cipcode = replace(cip,'.','');