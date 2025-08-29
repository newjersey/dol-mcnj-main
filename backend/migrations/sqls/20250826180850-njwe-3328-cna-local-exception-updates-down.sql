-- Remove the CIP 51.3902 entries that were added for all 10 counties
delete from localexceptioncips where
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'ATLANTIC' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902') or
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'MORRIS' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902') or
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'SUSSEX' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902') or
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'WARREN' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902') or
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'CAMDEN' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902') or
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'GLOUCESTER' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902') or
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'CAPE MAY' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902') or
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'SALEM' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902') or
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'CUMBERLAND' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902') or
    (soc = '31-1131' and occupation = 'Nursing Assistants' and county = 'PASSAIC' and cip = '51.3902' and cipdescription = 'Nursing Assistant/Aide and Patient Care Assistant/Aide.' and cipcode = '513902');

-- Restore the CIP 51.2601 entries that were removed for all 10 counties
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'ATLANTIC', '51.2601', 'Health Aide.', '512601');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'MORRIS', '51.2601', 'Health Aide.', '512601');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'SUSSEX', '51.2601', 'Health Aide.', '512601');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'WARREN', '51.2601', 'Health Aide.', '512601');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'CAMDEN', '51.2601', 'Health Aide.', '512601');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'GLOUCESTER', '51.2601', 'Health Aide.', '512601');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'CAPE MAY', '51.2601', 'Health Aide.', '512601');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'SALEM', '51.2601', 'Health Aide.', '512601');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'CUMBERLAND', '51.2601', 'Health Aide.', '512601');
insert into localexceptioncips (soc, occupation, county, cip, cipdescription, cipcode) values ('31-1131', 'Nursing Assistants', 'PASSAIC', '51.2601', 'Health Aide.', '512601');