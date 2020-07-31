alter table indemandcips add column cipcode character varying(16);
update indemandcips set cipcode = replace(cip,'.','');