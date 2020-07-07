create table programtokens (
   id integer NOT NULL PRIMARY KEY,
   tokens tsvector
);

insert into programtokens(id, tokens)
select programs.id,
       to_tsvector(programs.officialname) ||
       to_tsvector(coalesce(programs.description, '')) ||
       to_tsvector(coalesce((string_agg(soccipcrosswalk.soc2018title, ' ')), ''))
from programs
left outer join soccipcrosswalk
on programs.cipcode = soccipcrosswalk.cipcode
group by programs.id;