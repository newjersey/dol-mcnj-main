# -*- coding: utf-8 -*-
"""
Created on Thu Feb 18 13:59:05 2021

@author: prite
"""

import pandas as pd
from enum import Enum
import sys

def merge_lookup_label(result: pd.DataFrame, lookup_df: pd.DataFrame, column: str, lookup_id_column: str = "ID", lookup_label_column: str = "NAME"):
    """
    Returns a new dataframe with the same values as df, but with an additional column added that provides the
    descriptive label for the value in the provided column based on the provided lookup dataframe.

    The new column will be named "{column}{lookup_label_column}" based on the values of column and lookup_label_column,
    and will be inserted directly after column in the dataframe.

    Parameters:
    df (pandas.Dataframe): dataframe base for merge
    lookup_df (pandas.Dataframe): dataframe for lookup table with and id and label column
    column (str): name of column in df that contains id values from the lookup dataframe
    lookup_id_column (str): optional name for column in lookup_df that contains id value. Defaults to "ID"
    lookup_label_column (str): optional name for column in lookup_df that contains label value. Defaults to "NAME"
    """
    # Left merge df and just the id and label columns from the lookup data frame
    result = result.merge(right=lookup_df[[lookup_id_column, lookup_label_column]], how='left', left_on=column, right_on=lookup_id_column)
    # Remove the ID column from the result
    result.drop(columns=[lookup_id_column], inplace=True)
    # Reorder label column to be immediately after the original column used for the merge
    label_col = result.pop(lookup_label_column)
    result.insert(result.columns.get_loc(column)+1, f"{column}{lookup_label_column}", label_col)
    return result

def clean_official_name(df: pd.DataFrame):
    # replace special characters " and *
    df['OFFICIALNAME'] = df['OFFICIALNAME'].str.replace('[*,"]', '', regex=True)
    df['OFFICIALNAME'] = df['OFFICIALNAME'].str.replace('AAS', 'A.A.S.')
    return df

class CredentialType(Enum):
    # http://credreg.net/ctdl/terms/credentialType#Certificate
    # Credential that designates requisite knowledge and skills of an occupation, profession, or academic program.
    Certificate = 'Certificate'
    # http://credreg.net/ctdl/terms/credentialType#ApprenticeshipCertificate
    # Credential earned through work-based learning and earn-and-learn models that meet standards and are applicable to industry trades and professions.
    ApprenticeshipCertificate = 'Apprenticeship'
    # http://credreg.net/ctdl/terms/credentialType#JourneymanCertificate
    # Credential awarded to skilled workers on successful completion of an apprenticeship in industry trades and professions.
    JourneymanCertificate = 'Journeyman Certificate'
    # http://credreg.net/ctdl/terms/credentialType#MasterCertificate
    # Credential awarded upon demonstration through apprenticeship of the highest level of skills and performance in industry trades and professions.
    MasterCertificate = 'Master Certificate'

    # http://credreg.net/ctdl/terms/credentialType#Degree
    # Academic credential conferred upon completion of a program or course of study, typically over multiple years at a college or university.
    Degree = 'Degree'
    # http://credreg.net/ctdl/terms/credentialType#AssociateDegree
    # College/university award for students typically completing the first one to two years of post secondary school education.
    AssociateDegree = 'Associate Degree'
    # http://credreg.net/ctdl/terms/credentialType#BachelorDegree
    # College/university award for students typically completing three to five years of education where course work and activities advance skills beyond those of the first one to two years of college/university study.
    BachelorDegree = 'Bachelor Degree'
    # http://credreg.net/ctdl/terms/credentialType#MasterDegree
    # Credential awarded for a graduate level course of study where course work and activities advance skills beyond those of the bachelor's degree or its equivalent.
    MasterDegree = 'Masters Degree'
    # http://credreg.net/ctdl/terms/credentialType#DoctoralDegree
    # Highest credential award for students who have completed both a bachelor's degree and a master's degree or their equivalent as well as independent research and/or a significant project or paper.
    DoctoralDegree = 'Doctoral Degree'
    # http://credreg.net/ctdl/terms/credentialType#ProfessionalDoctorate
    # Doctoral degree conferred upon completion of a program providing the knowledge and skills for the recognition, credential, or license required for professional practice.
    ProfessionalDoctorate = 'Professional Doctorate'
    # http://credreg.net/ctdl/terms/credentialType#ResearchDoctorate
    # Doctoral degree conferred for advanced work beyond the master level, including the preparation and defense of a thesis or dissertation based on original research, or the planning and execution of an original project demonstrating substantial artistic or scholarly achievement.
    ResearchDoctorate = 'Research Doctorate'
    # http://credreg.net/ctdl/terms/credentialType#Badge
    # Recognition designed to be displayed as a marker of accomplishment, activity, achievement, skill, interest, association, or identity.
    Badge = 'Badge'
    # http://credreg.net/ctdl/terms/credentialType#DigitalBadge
    # Badge offered in digital form.
    DigitalBadge = 'Digital Badge'
    # http://credreg.net/ctdl/terms/credentialType#OpenBadge
    # Visual symbol containing verifiable claims in accordance with the Open Badges specification and delivered digitally.
    OpenBadge = 'Open Badge'

    # http://credreg.net/ctdl/terms/credentialType#CertificateOfCompletion
    # Credential that acknowledges completion of an assignment, training or other activity.
    CertificateOfCompletion = 'Certificate of Completion'

    # http://credreg.net/ctdl/terms/credentialType#Certification
    # Time-limited, revocable, renewable credential awarded by an authoritative body for demonstrating the knowledge, skills, and abilities to perform specific tasks or an occupation.
    Certification = 'Certification'

    # http://credreg.net/ctdl/terms/credentialType#Diploma
    # Credential awarded by educational institutions for successful completion of a course of study or its equivalent.
    Diploma = 'Diploma'
    # http://credreg.net/ctdl/terms/credentialType#GeneralEducationDevelopment
    # Credential awarded by examination that demonstrates that an individual has acquired secondary school-level academic skills.
    GeneralEducationDevelopment = 'General Education Diploma (GED)'
    # http://credreg.net/ctdl/terms/credentialType#SecondarySchoolDiploma
    # Diploma awarded by secondary education institutions for successful completion of a secondary school program of study.
    SecondarySchoolDiploma = 'Secondary School Diploma'

    # http://credreg.net/ctdl/terms/credentialType#License
    # Credential awarded by a government agency or other authorized organization that constitutes legal authority to do a specific job and/or utilize a specific item, system or infrastructure and are typically earned through some combination of degree or certificate attainment, certifications, assessments, work experience, and/or fees, and are time-limited and must be renewed periodically.
    License = 'License'

    # http://credreg.net/ctdl/terms/credentialType#MicroCredential
    # Credential that addresses a subset of field-specific knowledge, skills, or competencies; often developmental with relationships to other micro-credentials and field credentials.
    MicroCredential = 'MicroCredential'

    # http://credreg.net/ctdl/terms/credentialType#QualityAssuranceCredential
    # Credential assuring that an organization, program, or awarded credential meets prescribed requirements and may include development and administration of qualifying examinations.
    QualityAssuranceCredential = 'Quality Assurance Credential'

    # We want to seperately detect ESL, but credential engine does not currently support this type,
    # until it does, we will treat it the same as CertificateOfCompletion in the output.
    # Tracking need for this type in https://github.com/newjersey/d4ad/issues/401
    ESL = CertificateOfCompletion
    # We want to seperately detect Pre-Apprenticeships, but credential engine does not currently support this type,
    # until it does, we will treat it the same as CertificateOfCompletion in the output.
    # Tracking need for this type in https://github.com/newjersey/d4ad/issues/401
    PreApprenticeship = CertificateOfCompletion

    def __str__(self) -> str:
        return str(self.value)

def label_credential_type(row: pd.Series):
    # Certification
    official_name : str = row['OFFICIALNAME']

    if row['LEADTOLICENSE'] == "1" and row['LEADTOINDUSTRYCREDENTIAL'] == "0":
        return CredentialType.License

    if 'M.' in official_name and 'Master' in row['DEGREEAWARDEDNAME']:
        return CredentialType.MasterDegree

    ASSOCIATE_NAME_TOKENS = { 'A.S.', 'A.A.', 'A.A.S'}
    if any(map(official_name.__contains__, ASSOCIATE_NAME_TOKENS)) and ('A.S.E' not in official_name):
        return CredentialType.AssociateDegree

    ESL_NAME_TOKENS = { 'ESL', 'English as a Second Language'}
    if any(map(official_name.__contains__, ESL_NAME_TOKENS)):
        return CredentialType.ESL

    if 'High School Diploma - Adults' in official_name:
        return CredentialType.SecondarySchoolDiploma

    if 'Apprentice' in official_name and 'Pre-Apprentice' not in official_name:
        return CredentialType.ApprenticeshipCertificate

    if 'Pre-Apprentice' in official_name:
        return CredentialType.PreApprenticeship

    GED_NAME_TOKENS = { 'GED', 'General Education Diploma', 'High School Equivalence', 'High School Equivalency'}
    if any(map(official_name.__contains__, GED_NAME_TOKENS)):
        return CredentialType.GeneralEducationDevelopment

    if (row['LEADTOINDUSTRYCREDENTIAL'] == "1"):
        return CredentialType.Certification

    # TODO: Track Down Lookup Values for Provider TYPEIDs.
    # However, data analysis of our current dataset showed looking at the degree awarded field
    # for providers with these TYPEIDs where true postitives for that credential type while
    # providers with other TYPEIDs where false postitives for degree credential types
    TYPEIDS_FOR_DEGREE_GRANTING_PROVIDERS = { "3", "4" }

    # Label Associate Degree awarded from degree granting provider
    if row['DEGREEAWARDED'] == "200" and row['PROVIDERS_TYPEID'] in TYPEIDS_FOR_DEGREE_GRANTING_PROVIDERS:
        return CredentialType.AssociateDegree

    # Label Bachelor Degree awarded from degree granting provider
    if row['DEGREEAWARDED'] == "300" and row['PROVIDERS_TYPEID'] in TYPEIDS_FOR_DEGREE_GRANTING_PROVIDERS:
        return CredentialType.BachelorDegree

    # Label Master Degree awarded from degree granting provider
    if row['DEGREEAWARDED'] == "500" and row['PROVIDERS_TYPEID'] in TYPEIDS_FOR_DEGREE_GRANTING_PROVIDERS:
        return CredentialType.MasterDegree

    # Label Doctoral Degree awarded from degree granting provider
    if row['DEGREEAWARDED'] == "700" and row['PROVIDERS_TYPEID'] in TYPEIDS_FOR_DEGREE_GRANTING_PROVIDERS:
        return CredentialType.DoctoralDegree

    return CredentialType.CertificateOfCompletion


def export(df, yyyymmdd):
    df.to_csv(f'../programs_{yyyymmdd}_merged.csv', index=False, encoding='utf-8-sig')


def main():
    yyyymmdd = sys.argv[1]

    # Read in source data files
    programs_df = pd.read_csv(f"../programs_{yyyymmdd}.csv", dtype={
        # Read enum and lookup fields from csv as strings to preserve
        # value for comparison and prevent type coercion to floating point
        # types.
        "LEADTODEGREE": "str",
        "DEGREEAWARDED": "str",
        "LEADTOLICENSE": "str",
        "LICENSEAWARDED": "str",
        "LEADTOINDUSTRYCREDENTIAL": "str",
        "INDUSTRYCREDENTIAL": "str",
        "FINANCIALAID": "str",
        "CREDIT": "str",
        "CALENDARLENGTHID": "str",
        "PHONEEXTENSION": "str"
    })
    degree_lookup_df = pd.read_csv("./TBLDEGREELU_DATA_TABLE.csv", usecols=['ID', 'NAME'], dtype={
        'ID': "str", # match type for DEGREEAWARDED
        'Name': "str"
    })
    industry_credentials_lookup_df = pd.read_csv("./TBLINDUSTRYCREDENTIAL_DATA_TABLE.csv", usecols=['ID', 'NAME'], dtype={
        'ID': "str", # match type for INDUSTRYCREDENTIAL
        'Name': "str"
    })
    license_lookup_df = pd.read_csv("./TBLLICENSE_DATA_TABLE.csv", usecols=['ID', 'NAME'], dtype={
        'ID': "str", # match type for LICENSEAWARDED
        'Name': "str"
    })
    providers_df = pd.read_csv(f"../providers_{yyyymmdd}.csv", dtype={
        "TYPEID": "str"
    }).add_prefix("PROVIDERS_")

    # Remove private data from programs file
    programs_df.drop(['SUBMITTERNAME', 'SUBMITTERTITLE'], axis=1, inplace=True)

    # merge degree
    programs_df = merge_lookup_label(result=programs_df,lookup_df=degree_lookup_df, column="DEGREEAWARDED")

    # merge industry credential
    programs_df = merge_lookup_label(result=programs_df,lookup_df=industry_credentials_lookup_df, column="INDUSTRYCREDENTIAL")

    # merge license
    programs_df = merge_lookup_label(result=programs_df,lookup_df=license_lookup_df, column="LICENSEAWARDED")

    # Clean up Official Name
    programs_df = programs_df.pipe(clean_official_name)

    # merge providers information for use in credential type labeling
    merged_programs_providers = programs_df.merge(providers_df, how='left', left_on='PROVIDERID', right_on='PROVIDERS_PROVIDERID')
    # add Credential Types
    programs_df['CREDENTIALTYPE'] = merged_programs_providers.apply(label_credential_type, axis=1)
    # export to csv
    export(programs_df, yyyymmdd)


if __name__ == '__main__':
    main()
