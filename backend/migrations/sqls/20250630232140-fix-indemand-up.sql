TRUNCATE TABLE indemandsocs;
INSERT INTO indemandsocs (soc, occupationtitle) VALUES
                                                    ('11-3021', 'Computer and Information Systems Managers'),
                                                    ('11-3031', 'Financial Managers'),
                                                    ('11-9021', 'Construction Managers'),
                                                    ('11-9051', 'Food Service Managers'),
                                                    ('11-9111', 'Medical and Health Services Managers'),
                                                    ('11-9121', 'Natural Sciences Managers'),
                                                    ('11-9151', 'Social and Community Service Managers'),
                                                    ('13-1071', 'Human Resources Specialists'),
                                                    ('13-1081', 'Logisticians'),
                                                    ('13-1082', 'Project Management Specialists'),
                                                    ('13-1111', 'Management Analysts'),
                                                    ('13-1151', 'Training and Development Specialists'),
                                                    ('13-1161', 'Market Research Analysts and Marketing Specialists'),
                                                    ('13-2052', 'Personal Financial Advisors'),
                                                    ('13-2061', 'Financial Examiners'),
                                                    ('15-1211', 'Computer Systems Analysts'),
                                                    ('15-1212', 'Information Security Analysts'),
                                                    ('15-1252', 'Software Developers'),
                                                    ('15-1253', 'Software Quality Assurance Analysts and Testers'),
                                                    ('15-1254', 'Web Developers'),
                                                    ('15-1255', 'Web and Digital Interface Designers'),
                                                    ('15-2031', 'Operations Research Analysts'),
                                                    ('15-2051', 'Data Scientists'),
                                                    ('17-2071', 'Electrical Engineers'),
                                                    ('17-2112', 'Industrial Engineers'),
                                                    ('17-2141', 'Mechanical Engineers'),
                                                    ('19-1021', 'Biochemists and Biophysicists'),
                                                    ('19-2031', 'Chemists'),
                                                    ('19-3033', 'Clinical and Counseling Psychologists'),
                                                    ('19-4031', 'Chemical Technicians'),
                                                    ('19-5011', 'Occupational Health and Safety Specialists'),
                                                    ('21-1022', 'Healthcare Social Workers'),
                                                    ('21-1023', 'Mental Health and Substance Abuse Social Workers'),
                                                    ('21-1093', 'Social and Human Service Assistants'),
                                                    ('23-1011', 'Lawyers'),
                                                    ('25-3021', 'Self-Enrichment Teachers'),
                                                    ('25-3041', 'Tutors'),
                                                    ('27-1026', 'Merchandise Displayers and Window Trimmers'),
                                                    ('27-2022', 'Coaches and Scouts'),
                                                    ('27-3031', 'Public Relations Specialists'),
                                                    ('29-1031', 'Dietitians and Nutritionists'),
                                                    ('29-1071', 'Physician Assistants'),
                                                    ('29-1122', 'Occupational Therapists'),
                                                    ('29-1123', 'Physical Therapists'),
                                                    ('29-1126', 'Respiratory Therapists'),
                                                    ('29-1127', 'Speech-Language Pathologists'),
                                                    ('29-1141', 'Registered Nurses'),
                                                    ('29-1171', 'Nurse Practitioners'),
                                                    ('29-1215', 'Family Medicine Physicians'),
                                                    ('29-1292', 'Dental Hygienists'),
                                                    ('29-2011', 'Medical and Clinical Laboratory Technologists'),
                                                    ('29-2012', 'Medical and Clinical Laboratory Technicians'),
                                                    ('29-2032', 'Diagnostic Medical Sonographers'),
                                                    ('29-2034', 'Radiologic Technologists and Technicians'),
                                                    ('29-2042', 'Emergency Medical Technicians'),
                                                    ('29-2052', 'Pharmacy Technicians'),
                                                    ('29-2055', 'Surgical Technologists'),
                                                    ('29-2056', 'Veterinary Technologists and Technicians'),
                                                    ('29-2061', 'Licensed Practical and Licensed Vocational Nurses'),
                                                    ('29-2072', 'Medical Records Specialists'),
                                                    ('31-1121', 'Home Health Aides'),
                                                    ('31-1122', 'Personal Care Aides'),
                                                    ('31-2021', 'Physical Therapist Assistants'),
                                                    ('31-2022', 'Physical Therapist Aides'),
                                                    ('31-9011', 'Massage Therapists'),
                                                    ('31-9091', 'Dental Assistants'),
                                                    ('31-9092', 'Medical Assistants'),
                                                    ('31-9093', 'Medical Equipment Preparers'),
                                                    ('31-9097', 'Phlebotomists'),
                                                    ('35-1011', 'Chefs and Head Cooks'),
                                                    ('35-1012', 'First-Line Supervisors of Food Preparation and Serving Workers'),
                                                    ('35-3011', 'Bartenders');

TRUNCATE TABLE indemandcips;

-- Insert new CIP codes based on current in-demand SOCs and the crosswalk
INSERT INTO indemandcips (cip, cipcode, ciptitle)
SELECT DISTINCT cip2020code, crosswalk.cipcode, crosswalk.cip2020title
FROM soccipcrosswalk AS crosswalk
         JOIN indemandsocs AS demand
              ON crosswalk.soc2018code = demand."soc"
ORDER BY crosswalk.cipcode;