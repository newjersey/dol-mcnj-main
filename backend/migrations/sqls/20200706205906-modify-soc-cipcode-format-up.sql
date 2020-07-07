alter table soccipcrosswalk add column cipcode character varying(16);
update soccipcrosswalk set cipcode = replace(cip2020code,'.','');