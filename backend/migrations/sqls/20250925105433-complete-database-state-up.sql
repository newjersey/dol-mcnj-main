--
-- PostgreSQL database dump
--


-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blsoccupationhandbook; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.blsoccupationhandbook (
    current_year integer,
    current_year_agg integer,
    last_updated character varying(16),
    occupation_id integer,
    occupation_citation text,
    occupation_description_type character varying(8),
    occupation_description text,
    occupation_how_to_become_one_section_body_type character varying(8),
    occupation_how_to_become_one_section_body text,
    occupation_how_to_become_one_section_image_type character varying(8),
    occupation_how_to_become_one_section_image text,
    occupation_how_to_become_one_section_title_type character varying(8),
    occupation_how_to_become_one_section_title text,
    occupation_image_type character varying(8),
    occupation_image text,
    occupation_job_outlook_section_body_type character varying(8),
    occupation_job_outlook_section_body text,
    occupation_job_outlook_section_chart_type character varying(8),
    occupation_job_outlook_section_chart text,
    occupation_job_outlook_section_datatable_type character varying(8),
    occupation_job_outlook_section_datatable text,
    occupation_job_outlook_section_title_type character varying(8),
    occupation_job_outlook_section_title text,
    occupation_more_information_section_body_type character varying(8),
    occupation_more_information_section_body text,
    occupation_more_information_section_title_type character varying(8),
    occupation_more_information_section_title text,
    occupation_occupation_code character varying(8),
    occupation_occupation_name_full_type character varying(8),
    occupation_occupation_name_full text,
    occupation_occupation_name_short_plural_type character varying(8),
    occupation_occupation_name_short_plural text,
    occupation_occupation_name_short_singular_type character varying(8),
    occupation_occupation_name_short_singular text,
    occupation_pay_section_body_type character varying(8),
    occupation_pay_section_body text,
    occupation_pay_section_chart_html_type character varying(8),
    occupation_pay_section_chart_html text,
    occupation_pay_section_title_type character varying(8),
    occupation_pay_section_title text,
    occupation_publish_date_format character varying(16),
    occupation_publish_date_type character varying(8),
    occupation_publish_date character varying(16),
    occupation_publish_time_format character varying(16),
    occupation_publish_time_note text,
    occupation_publish_time_type character varying(8),
    occupation_publish_time character varying(8),
    occupation_quick_facts_qf_employment_openings_help_type character varying(8),
    occupation_quick_facts_qf_employment_openings_help text,
    occupation_quick_facts_qf_employment_openings_value_type character varying(8),
    occupation_quick_facts_qf_employment_openings_value integer,
    occupation_quick_facts_qf_employment_openings_value_agg integer,
    occupation_quick_facts_qf_employment_outlook_description text,
    occupation_quick_facts_qf_employment_outlook_help_type character varying(8),
    occupation_quick_facts_qf_employment_outlook_help text,
    occupation_quick_facts_qf_employment_outlook_range_type character varying(8),
    occupation_quick_facts_qf_employment_outlook_range text,
    occupation_quick_facts_qf_employment_outlook_value_type character varying(8),
    occupation_quick_facts_qf_employment_outlook_value integer,
    occupation_quick_facts_qf_employment_outlook_value_agg integer,
    occupation_quick_facts_qf_entry_level_education_help_type character varying(8),
    occupation_quick_facts_qf_entry_level_education_help text,
    occupation_quick_facts_qf_entry_level_education_value_type character varying(8),
    occupation_quick_facts_qf_entry_level_education_value text,
    occupation_quick_facts_qf_median_pay_annual_help_type character varying(8),
    occupation_quick_facts_qf_median_pay_annual_help text,
    occupation_quick_facts_qf_median_pay_annual_note_type character varying(8),
    occupation_quick_facts_qf_median_pay_annual_note text,
    occupation_quick_facts_qf_median_pay_annual_range_type character varying(8),
    occupation_quick_facts_qf_median_pay_annual_range text,
    occupation_quick_facts_qf_median_pay_annual_value_type character varying(8),
    occupation_quick_facts_qf_median_pay_annual_value integer,
    occupation_quick_facts_qf_median_pay_annual_value_agg integer,
    occupation_quick_facts_qf_median_pay_hourly_help_type character varying(8),
    occupation_quick_facts_qf_median_pay_hourly_help text,
    occupation_quick_facts_qf_median_pay_hourly_note_type character varying(8),
    occupation_quick_facts_qf_median_pay_hourly_note text,
    occupation_quick_facts_qf_median_pay_hourly_value_type character varying(8),
    occupation_quick_facts_qf_median_pay_hourly_value numeric,
    occupation_quick_facts_qf_median_pay_hourly_value_agg numeric,
    occupation_quick_facts_qf_number_of_jobs_help_type character varying(8),
    occupation_quick_facts_qf_number_of_jobs_help text,
    occupation_quick_facts_qf_number_of_jobs_range_type character varying(8),
    occupation_quick_facts_qf_number_of_jobs_range text,
    occupation_quick_facts_qf_number_of_jobs_value_type character varying(8),
    occupation_quick_facts_qf_number_of_jobs_value integer,
    occupation_quick_facts_qf_number_of_jobs_value_agg integer,
    occupation_quick_facts_qf_on_the_job_training_help_type character varying(8),
    occupation_quick_facts_qf_on_the_job_training_help text,
    occupation_quick_facts_qf_on_the_job_training_value_type character varying(8),
    occupation_quick_facts_qf_on_the_job_training_value text,
    occupation_quick_facts_qf_work_experience_help_type character varying(8),
    occupation_quick_facts_qf_work_experience_help text,
    occupation_quick_facts_qf_work_experience_value_type character varying(8),
    occupation_quick_facts_qf_work_experience_value text,
    occupation_similar_occupations_section_body_type character varying(8),
    occupation_similar_occupations_section_body text,
    occupation_similar_occupations_section_title_type character varying(8),
    occupation_similar_occupations_section_title text,
    occupation_soc_coverage_soc_code_type character varying(8),
    occupation_soc_coverage_soc_code character varying(16),
    occupation_state_and_area_section_body_type character varying(8),
    occupation_state_and_area_section_body text,
    occupation_state_and_area_section_title_type character varying(8),
    occupation_state_and_area_section_title text,
    occupation_summary_how_to_become_one_type character varying(8),
    occupation_summary_how_to_become_one text,
    occupation_summary_more_information_type character varying(8),
    occupation_summary_more_information text,
    occupation_summary_outlook_type character varying(8),
    occupation_summary_outlook text,
    occupation_summary_pay_type character varying(8),
    occupation_summary_pay text,
    occupation_summary_similar_occupations_type character varying(8),
    occupation_summary_similar_occupations text,
    occupation_summary_state_and_area_type character varying(8),
    occupation_summary_state_and_area text,
    occupation_summary_what_they_do_type character varying(8),
    occupation_summary_what_they_do text,
    occupation_summary_work_environment_type character varying(8),
    occupation_summary_work_environment text,
    occupation_title_type character varying(8),
    occupation_title text,
    occupation_video_link text,
    occupation_what_they_do_section_body_type character varying(8),
    occupation_what_they_do_section_body text,
    occupation_what_they_do_section_image_type character varying(8),
    occupation_what_they_do_section_image text,
    occupation_what_they_do_section_title_type character varying(8),
    occupation_what_they_do_section_title text,
    occupation_work_environment_section_body_type character varying(8),
    occupation_work_environment_section_body text,
    occupation_work_environment_section_image_type character varying(8),
    occupation_work_environment_section_image text,
    occupation_work_environment_section_title_type character varying(8),
    occupation_work_environment_section_title text,
    projection_year integer,
    projection_year_agg integer,
    publication_title text,
    reference_period text,
    reference_year integer,
    reference_year_agg integer
);


--
-- Name: etpl; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.etpl (
    providerid character varying(16),
    officialname character varying(256),
    cipcode character varying(16),
    approvingagencyid character varying(8),
    otheragency character varying(256),
    submittedtowib character varying(64),
    tuition numeric,
    fees numeric,
    booksmaterialscost numeric,
    suppliestoolscost numeric,
    othercosts numeric,
    totalcost numeric,
    prerequisites text,
    wiaeligible character varying(8),
    leadtodegree boolean,
    degreeawarded character varying(8),
    leadtolicense boolean,
    licenseawarded character varying(8),
    leadtoindustrycredential boolean,
    industrycredential character varying(8),
    financialaid character varying(8),
    description text,
    credit text,
    totalclockhours numeric,
    calendarlengthid character varying(8),
    featuresdescription text,
    wibcomment text,
    statecomment text,
    submitted timestamp without time zone,
    approved character varying(8),
    contactname character varying(256),
    contactphone character varying(16),
    contactphoneextension character varying(8),
    programid character varying(8) NOT NULL,
    statusname character varying(16),
    name character varying(256),
    schoolidentificationnumber character varying(64),
    street1 character varying(128),
    street2 character varying(128),
    city character varying(64),
    state character varying(8),
    zip character varying(16),
    county character varying(32),
    mstreet1 character varying(128),
    mstreet2 character varying(128),
    mcity character varying(64),
    mstate character varying(8),
    mzip character varying(16),
    contactfirstname character varying(128),
    contactlastname character varying(128),
    contacttitle character varying(128),
    phone character varying(16),
    phoneextension character varying(8),
    fax character varying(16),
    website character varying(256),
    email character varying(256),
    licensingagencyid character varying(16),
    typeid character varying(16),
    nongovapproval character varying(128),
    certapprovalexp timestamp without time zone,
    customized character varying(8),
    distancelearning character varying(8),
    speakspanish character varying(8),
    otherlanguages character varying(8),
    languages character varying(256),
    careerassist character varying(8),
    onestopcareer character varying(8),
    personalassist character varying(8),
    accessajbatb character varying(8),
    childcare character varying(8),
    assistobtainingchildcare character varying(8),
    eveningcourses character varying(8),
    accessfordisabled character varying(8),
    busroute1 character varying(256),
    busroute2 character varying(256),
    trnroute1 character varying(256),
    trnroute2 character varying(256),
    providerwibcomment text,
    providerstatecomment text,
    dtsubmitted timestamp without time zone,
    providerstatusname character varying(64),
    standardized_name text,
    standardized_name_1 text,
    standardized_description text,
    standardized_featuresdescription text,
    mentions_wioa character varying(32),
    default_job_search_duration character varying(32),
    mentioned_job_search_duration character varying(32),
    google_direction_url text,
    mention_hybrid boolean,
    mention_inperson boolean,
    mention_remote boolean,
    commented_suspended_program_status boolean,
    standardized_nongovapproval text,
    degreeawardedname text,
    licenseawardedname text,
    industrycredentialname text,
    credentialtype text,
    programnewtonjtopps text,
    providernewtonjtopps text
);


--
-- Name: indemandcips; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.indemandcips (
    cip character varying(16),
    ciptitle character varying(256),
    cipcode character varying(16)
);


--
-- Name: indemandsocs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.indemandsocs (
    soc character varying(16),
    occupationtitle character varying(256)
);


--
-- Name: localexceptioncips; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.localexceptioncips (
    soc character varying(16),
    occupation character varying(256),
    county character varying(128),
    cip character varying(16),
    cipdescription character varying(256),
    cipcode character varying(16)
);


--
-- Note: migrations_id_seq removed - this is managed by db-migrate internally
--


--
-- Name: oesestimates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.oesestimates (
    area integer,
    area_title text,
    area_type integer,
    naics integer,
    naics_title text,
    i_group text,
    own_code integer,
    occ_code character varying(32),
    occ_title text,
    o_group character varying(32),
    tot_emp character varying(32),
    emp_prse character varying(32),
    jobs_1000 character varying(32),
    loc_quotient character varying(32),
    pct_total character varying(32),
    h_mean character varying(32),
    a_mean character varying(32),
    mean_prse character varying(32),
    h_pct10 character varying(32),
    h_pct25 character varying(32),
    h_median character varying(32),
    h_pct75 character varying(32),
    h_pct90 character varying(32),
    a_pct10 character varying(32),
    a_pct25 character varying(32),
    a_median character varying(32),
    a_pct75 character varying(32),
    a_pct90 character varying(32),
    annual boolean,
    hourly boolean
);


--
-- Name: oeshybridcrosswalk; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.oeshybridcrosswalk (
    oes2019estimatescode character varying(16),
    oes2019estimatestitle character varying(256),
    soccode2018 character varying(16),
    soctitle2018 character varying(256),
    oes2018estimatescode character varying(16),
    oes2018estimatestitle character varying(256),
    soccode2010 character varying(16),
    soctitle2010 character varying(256),
    notes text
);


--
-- Name: onlineprograms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.onlineprograms (
    programid character varying(8)
);


--
-- Name: outcomes_cip; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.outcomes_cip (
    providerid character varying(16),
    cipcode character varying(16),
    peremployed2 numeric,
    peremployed4 numeric,
    peremployed8 numeric,
    avgquarterlywage2 numeric,
    avgquarterlywage4 numeric,
    avgquarterlywage8 numeric,
    perretention4 numeric,
    perretention8 numeric,
    numcompleted2 integer,
    numcompleted4 integer,
    numcompleted8 integer,
    numusedwagecalc2 integer,
    numusedwagecalc4 integer,
    numusedwagecalc8 integer,
    numusedretentioncalc4 integer,
    numusedretentioncalc8 integer,
    id integer NOT NULL
);


--
-- Name: outcomes_cip_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE IF NOT EXISTS public.outcomes_cip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: outcomes_cip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.outcomes_cip_id_seq OWNED BY public.outcomes_cip.id;


--
-- Name: programtokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.programtokens (
    tokens tsvector,
    programid character varying(8) NOT NULL
);


--
-- Name: soc2010to2018crosswalk; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.soc2010to2018crosswalk (
    soccode2010 character varying(16),
    soctitle2010 character varying(256),
    soccode2018 character varying(16),
    soctitle2018 character varying(256)
);


--
-- Name: soccipcrosswalk; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.soccipcrosswalk (
    soc2018code character varying(16),
    soc2018title character varying(256),
    cip2020code character varying(16),
    cip2020title character varying(256),
    cipcode character varying(16)
);


--
-- Name: socdefinitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.socdefinitions (
    socgroup character varying(16),
    soccode character varying(16),
    soctitle character varying(256),
    socdefinition text
);


--
-- Name: outcomes_cip id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outcomes_cip ALTER COLUMN id SET DEFAULT nextval('public.outcomes_cip_id_seq'::regclass);


--
-- Name: etpl etpl_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'etpl_pkey') THEN 
        ALTER TABLE ONLY public.etpl ADD CONSTRAINT etpl_pkey PRIMARY KEY (programid); 
    END IF; 
END $$;

--
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'outcomes_cip_pkey') THEN 
        ALTER TABLE ONLY public.outcomes_cip ADD CONSTRAINT outcomes_cip_pkey PRIMARY KEY (id); 
    END IF; 
END $$;


--
-- Name: programtokens programtokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'programtokens_pkey') THEN 
        ALTER TABLE ONLY public.programtokens ADD CONSTRAINT programtokens_pkey PRIMARY KEY (programid); 
    END IF; 
END $$;

--
-- PostgreSQL database dump complete
--



-- Data Import

--
