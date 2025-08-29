-- Add CIP 51.3902 (Nursing Assistant/Aide and Patient Care Assistant/Aide) for all 10 counties
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'ATLANTIC', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'MORRIS', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'SUSSEX', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'WARREN', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'CAMDEN', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'GLOUCESTER', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'CAPE MAY', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'SALEM', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'CUMBERLAND', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'PASSAIC', '51.3902', 'Nursing Assistant/Aide and Patient Care Assistant/Aide.', '513902');

-- Remove CIP 51.2601 (Health Aide) entries since LPNs are already in-demand occupations
delete from localexceptioncips 
where soc = '31-1131' 
  and cip = '51.2601' 
  and county in ('ATLANTIC', 'MORRIS', 'SUSSEX', 'WARREN', 'CAMDEN', 'GLOUCESTER', 'CAPE MAY', 'SALEM', 'CUMBERLAND', 'PASSAIC');