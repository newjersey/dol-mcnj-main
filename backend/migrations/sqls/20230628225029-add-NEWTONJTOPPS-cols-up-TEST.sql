ALTER TABLE etpl
    ADD COLUMN programnewtonjtopps text,
    ADD COLUMN providernewtonjtopps text;

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