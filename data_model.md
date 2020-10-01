# Data Model

The purpose of this document is to represent the current data structure of tables.  As the quantity of data
we store increases, it seems to be more important to represent how the data is stored and where.

As much as possible, I have attempted to minimize all pre-processing done to CSV files before importing
them into data tables, so that any data can be replaced with ease, without any special manual steps ahead of time.
For this reason, many tables have extraneous columns that are not used (or not _yet_ used).

### Table(s) of Contents

- [`etpl`](#etpl)
- [`soccipcrosswalk`](#soccipcrosswalk)
- [`programtokens`](#programtokens)
- [`indemandcips`](#indemandcips)
- [`localexceptioncips`](#localexceptioncips)
- [`onlineprograms`](#onlineprograms)
- [`indemandsocs`](#indemandsocs)
- [`socdefinitions`](#socdefinitions)
- [`soc2010to2018crosswalk`](#soc2010to2018crosswalk)


### etpl

This is the ETPL source of truth.  Has a row for every program and its provider
(so provider data may be duplicated on many rows)
Columns with no description are not yet used in the app.

column name | description
------------|------------
PROVIDERID |
OFFICIALNAME | program title
CIPCODE | training category code
APPROVINGAGENCYID |
OTHERAGENCY |
SUBMITTEDTOWIB |
TUITION | tuition cost
FEES | fees cost
BOOKSMATERIALSCOST | books & materials cost
SUPPLIESTOOLSCOST | supplies & tools cost
OTHERCOSTS | other costs
TOTALCOST | total sum cost of program
PREREQUISITES |
WIAELIGIBLE |
LEADTODEGREE |
DEGREEAWARDED |
LEADTOLICENSE |
LICENSEAWARDED |
LEADTOINDUSTRYCREDENTIAL |
INDUSTRYCREDENTIAL |
FINANCIALAID |
DESCRIPTION | long-form description
CREDIT |
TOTALCLOCKHOURS |
CALENDARLENGTHID | value 1 - 10; how long takes to complete
FEATURESDESCRIPTION |
WIBCOMMENT |
STATECOMMENT |
SUBMITTED |
APPROVED |
CONTACTNAME |
CONTACTPHONE |
CONTACTPHONEEXTENSION |
PROGRAMID | primary key
STATUSNAME | 'Approved'/'Suspend'/'Pending'/null
PROVIDERNAME | name of the school/org
SCHOOLIDENTIFICATIONNUMBER |
STREET1 | street address: line 1
STREET2 | street address: line 2
CITY | street address: city
STATE | street address: state
ZIP | street address: zip code
COUNTY |
MSTREET1 |
MSTREET2 |
MCITY |
MSTATE |
MZIP |
CONTACTFIRSTNAME | contact person first name
CONTACTLASTNAME | contact person last name
CONTACTTITLE | contact person title
PHONE | phone number
PHONEEXTENSION | optional phone extension
FAX |
WEBSITE | main webpage for provider
EMAIL |
LICENSINGAGENCYID |
TYPEID |
NONGOVAPPROVAL |
CERTAPPROVALEXP |
CUSTOMIZED |
DISTANCELEARNING |
SPEAKSPANISH |
OTHERLANGUAGES |
LANGUAGES |
CAREERASSIST |
ONESTOPCAREER |
PERSONALASSIST |
ACCESSAJBATB |
CHILDCARE |
ASSISTOBTAININGCHILDCARE |
EVENINGCOURSES |
ACCESSFORDISABLED |
BUSROUTE1 |
BUSROUTE2 |
TRNROUTE1 |
TRNROUTE2 |
PROVIDERWIBCOMMENT |
PROVIDERSTATECOMMENT |
DTSUBMITTED |
PROVIDERSTATUSNAME | 'Approved'/'Suspend'/'Pending'/null

### soccipcrosswalk

This table is pulled from the [IPEDS CIP/SOC Crosswalk data](https://nces.ed.gov/ipeds/cipcode/resources.aspx?y=55).
It documents the many-to-many relationship between SOCs and CIPs.

column name | description
------------|------------
SOC2018Code | SOC code
SOC2018Title | SOC title (used in "Career Track" data for a training
CIP2020Code | CIP code in format with a decimal (like "22.0304")
CIP2020Title | CIP title
cipcode | non-decimal generated column like "220304" (referenced by `CIPCODE` column in `programs`


### programtokens

This table is generated from the programs data and stores the token (`ts_vector`) data used for postgres
full-text search.
It needs to be updated (or recreated) every time the program data changes.

column name | description
------------|------------
programid | primary key, references same column in `programs`
tokens | tsvector column combining the `title`, `description` from `programs`, and `SOC2018Title` column from `soccipcrosswalk`

### indemandcips

This table is pulled from New Jersey's list of CIPs that correspond to in-demand SOCs.

column name | description
------------|------------
CIP | CIP code in format with a decimal (like "22.0304")
CIPTitle |
cipcode | non-decimal generated column like "220304" (referenced by `CIPCODE` column in `programs`

### localexceptioncips

This table is a short list of CIPs that have a local exception in a specific county that makes
them available for a training waiver in that county.
Columns with no description are not yet used in the app.

column name | description
------------|------------
SOC |
OCCUPATION |
COUNTY | county in which that CIP is waived
CIP |  CIP code in format with a decimal (like "22.0304")
CIPDESCRIPTION |
cipcode | non-decimal generated column like "220304" (referenced by `CIPCODE` column in `programs`


### onlineprograms

This is a lookup table of program ids. Presence in this table indicates that a program is available online.

column name | description
------------|------------
PROGRAMID | references `programid` in `programs` table


### indemandsocs

This table is pulled from New Jersey's list of in-demand SOCs/CIPs.
Right now, we don't use the OCCUPTATION TITLE column (it just came with the data).
The `socdefinitions` table is the source of truth for the title.

column name | description
------------|------------
SOC | SOC code
OCCUPATIONTITLE |

### socdefinitions

Source of truth from [Bureau of Labor Statistics](https://www.bls.gov/soc/2018/home.htm) for every SOC code and its breakdown
into major/minor/ect categories.


column name | description
------------|------------
SOCGroup | 'Major'/'Minor'/'Broad'/'Detailed'
SOCCode | SOC code
SOCTitle | official title
SOCDefinition |

### soc2010to2018crosswalk

Source of truth from [Bureau of Labor Statistics](https://www.bls.gov/soc/2018/crosswalks_used_by_agencies.htm) for
crosswalking from the 2010 SOC system to the 2018 SOC system.

**Please note** that the column headers had to be changed from the original values in the CSV sheet because
database columns cannot start with a number.  So `2010SOCCode` -> `SOCCode2010`, etc.

column name | description
------------|------------
SOCCode2010 | 2010 SOC code, used by in-demand SOCs
SOCTitle2010 |
SOCCode2018 | 2018 SOC code, what we use for the site
SOCTitle2018 |

### blsoccupationhandbook

Source of truth from [Bureau of Labor Statistics Occupational Outlook Handbook](https://www.bls.gov/ooh/about/ooh-developer-info.htm)

**Please note** Data is converted to a CSV from original XML format and column header names are changed in the CSV because `/` cannot exist in database column headers. ex: /occupation/citation -> occupation_citation

column name | description
------------|------------
current_year |
current_year_agg |
last_updated |
occupation_id |
occupation_citation |
occupation_description_type |
occupation_description |
occupation_how_to_become_one_section_body_type |
occupation_how_to_become_one_section_body |
occupation_how_to_become_one_section_image_type |
occupation_how_to_become_one_section_image |
occupation_how_to_become_one_section_title_type |
occupation_how_to_become_one_section_title |
occupation_image_type |
occupation_image |
occupation_job_outlook_section_body_type |
occupation_job_outlook_section_body |
occupation_job_outlook_section_chart_type |
occupation_job_outlook_section_chart |
occupation_job_outlook_section_datatable_type |
occupation_job_outlook_section_datatable |
occupation_job_outlook_section_title_type |
occupation_job_outlook_section_title |
occupation_more_information_section_body_type |
occupation_more_information_section_body |
occupation_more_information_section_title_type |
occupation_more_information_section_title |
occupation_occupation_code |
occupation_occupation_name_full_type |
occupation_occupation_name_full |
occupation_occupation_name_short_plural_type |
occupation_occupation_name_short_plural |
occupation_occupation_name_short_singular_type |
occupation_occupation_name_short_singular |
occupation_pay_section_body_type |
occupation_pay_section_body |
occupation_pay_section_chart_html_type |
occupation_pay_section_chart_html |
occupation_pay_section_title_type |
occupation_pay_section_title |
occupation_publish_date_format |
occupation_publish_date_type |
occupation_publish_date |
occupation_publish_time_format |
occupation_publish_time_note |
occupation_publish_time_type |
occupation_publish_time |
occupation_quick_facts_qf_employment_openings_help_type |
occupation_quick_facts_qf_employment_openings_help |
occupation_quick_facts_qf_employment_openings_value_type |
occupation_quick_facts_qf_employment_openings_value |
occupation_quick_facts_qf_employment_openings_value_agg |
occupation_quick_facts_qf_employment_outlook_description |
occupation_quick_facts_qf_employment_outlook_help_type |
occupation_quick_facts_qf_employment_outlook_help |
occupation_quick_facts_qf_employment_outlook_range_type |
occupation_quick_facts_qf_employment_outlook_range |
occupation_quick_facts_qf_employment_outlook_value_type |
occupation_quick_facts_qf_employment_outlook_value |
occupation_quick_facts_qf_employment_outlook_value_agg |
occupation_quick_facts_qf_entry_level_education_help_type |
occupation_quick_facts_qf_entry_level_education_help |
occupation_quick_facts_qf_entry_level_education_value_type |
occupation_quick_facts_qf_entry_level_education_value |
occupation_quick_facts_qf_median_pay_annual_help_type |
occupation_quick_facts_qf_median_pay_annual_help |
occupation_quick_facts_qf_median_pay_annual_note_type |
occupation_quick_facts_qf_median_pay_annual_note |
occupation_quick_facts_qf_median_pay_annual_range_type |
occupation_quick_facts_qf_median_pay_annual_range |
occupation_quick_facts_qf_median_pay_annual_value_type |
occupation_quick_facts_qf_median_pay_annual_value |
occupation_quick_facts_qf_median_pay_annual_value_agg |
occupation_quick_facts_qf_median_pay_hourly_help_type |
occupation_quick_facts_qf_median_pay_hourly_help |
occupation_quick_facts_qf_median_pay_hourly_note_type |
occupation_quick_facts_qf_median_pay_hourly_note |
occupation_quick_facts_qf_median_pay_hourly_value_type |
occupation_quick_facts_qf_median_pay_hourly_value |
occupation_quick_facts_qf_median_pay_hourly_value_agg |
occupation_quick_facts_qf_number_of_jobs_help_type |
occupation_quick_facts_qf_number_of_jobs_help |
occupation_quick_facts_qf_number_of_jobs_range_type |
occupation_quick_facts_qf_number_of_jobs_range |
occupation_quick_facts_qf_number_of_jobs_value_type |
occupation_quick_facts_qf_number_of_jobs_value |
occupation_quick_facts_qf_number_of_jobs_value_agg |
occupation_quick_facts_qf_on_the_job_training_help_type |
occupation_quick_facts_qf_on_the_job_training_help |
occupation_quick_facts_qf_on_the_job_training_value_type |
occupation_quick_facts_qf_on_the_job_training_value |
occupation_quick_facts_qf_work_experience_help_type |
occupation_quick_facts_qf_work_experience_help |
occupation_quick_facts_qf_work_experience_value_type |
occupation_quick_facts_qf_work_experience_value |
occupation_similar_occupations_section_body_type |
occupation_similar_occupations_section_body |
occupation_similar_occupations_section_title_type |
occupation_similar_occupations_section_title |
occupation_soc_coverage_soc_code_type |
occupation_soc_coverage_soc_code | SOC code
occupation_state_and_area_section_body_type |
occupation_state_and_area_section_body |
occupation_state_and_area_section_title_type |
occupation_state_and_area_section_title |
occupation_summary_how_to_become_one_type |
occupation_summary_how_to_become_one | How to become one summary text
occupation_summary_more_information_type |
occupation_summary_more_information |
occupation_summary_outlook_type |
occupation_summary_outlook |
occupation_summary_pay_type |
occupation_summary_pay |
occupation_summary_similar_occupations_type |
occupation_summary_similar_occupations |
occupation_summary_state_and_area_type |
occupation_summary_state_and_area |
occupation_summary_what_they_do_type |
occupation_summary_what_they_do |
occupation_summary_work_environment_type |
occupation_summary_work_environment |
occupation_title_type |
occupation_title |
occupation_video_link |
occupation_what_they_do_section_body_type |
occupation_what_they_do_section_body |
occupation_what_they_do_section_image_type |
occupation_what_they_do_section_image |
occupation_what_they_do_section_title_type |
occupation_what_they_do_section_title |
occupation_work_environment_section_body_type |
occupation_work_environment_section_body |
occupation_work_environment_section_image_type |
occupation_work_environment_section_image |
occupation_work_environment_section_title_type |
occupation_work_environment_section_title |
projection_year |
projection_year_agg |
publication_title |
reference_period |
reference_year |
reference_year_agg |

### blsoccupationhandbook

Source of truth from [Bureau of Labor Statistics Occupational Employment Statistics](https://www.bls.gov/oes/tables.htm)


column name | description
------------|------------
area |
area_title | Area name (US State and Territories)
area_type |
naics |
naics_title |
i_group |
own_code |
occ_code | The 6-digit Standard Occupational Classification (SOC) code or OES-specific code for the occupation
occ_title |
o_group |
tot_emp |
emp_prse |
jobs_1000 |
loc_quotient |
pct_total |
h_mean |
a_mean |
mean_prse |
h_pct10 |
h_pct25 |
h_median |
h_pct75 |
h_pct90 |
a_pct10 |
a_pct25 |
a_median | Annual median wage (or the 50th percentile)
a_pct75 |
a_pct90 |
annual |
hourly |
