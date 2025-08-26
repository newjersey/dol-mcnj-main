-- Add CIP 51.3902 (Nursing Assistant/Aide and Patient Care Assistant/Aide) for counties that need it
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'ATLANTIC', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'CAMDEN', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'CAPE MAY', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'CUMBERLAND', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'SALEM', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');

-- Remove CIP 51.2601 (Health Aide) entries since LPNs are already in-demand occupations
delete from localexceptioncips 
where soc = '31-1131' 
  and cip = '51.2601' 
  and county in ('ATLANTIC', 'CAMDEN', 'CAPE MAY', 'CUMBERLAND', 'SALEM', 'MORRIS', 'SUSSEX', 'WARREN', 'PASSAIC');