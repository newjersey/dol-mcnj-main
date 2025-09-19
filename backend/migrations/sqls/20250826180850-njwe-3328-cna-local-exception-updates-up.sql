-- Add CIP 51.3902 (Nursing Assistant/Aide and Patient Care Assistant/Aide) for all 10 counties
-- Check for duplicates before inserting to prevent constraint violations
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'ATLANTIC', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'ATLANTIC' and cip = '51.3902');

insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'MORRIS', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'MORRIS' and cip = '51.3902');

insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'SUSSEX', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'SUSSEX' and cip = '51.3902');

insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'WARREN', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'WARREN' and cip = '51.3902');

insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'CAMDEN', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'CAMDEN' and cip = '51.3902');

insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'GLOUCESTER', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'GLOUCESTER' and cip = '51.3902');

insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'CAPE MAY', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'CAPE MAY' and cip = '51.3902');

insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'SALEM', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'SALEM' and cip = '51.3902');

insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'CUMBERLAND', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'CUMBERLAND' and cip = '51.3902');

insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) 
select '31-1131', 'Nursing Assistants', 'PASSAIC', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902'
where not exists (select 1 from localexceptioncips where soc = '31-1131' and county = 'PASSAIC' and cip = '51.3902');

-- Remove CIP 51.2601 (Health Aide) entries since LPNs are already in-demand occupations
delete from localexceptioncips 
where soc = '31-1131' 
  and cip = '51.2601' 
  and county in ('ATLANTIC', 'MORRIS', 'SUSSEX', 'WARREN', 'CAMDEN', 'GLOUCESTER', 'CAPE MAY', 'SALEM', 'CUMBERLAND', 'PASSAIC');