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
NAME | name of the school/org/provider 
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