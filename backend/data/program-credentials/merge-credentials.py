# -*- coding: utf-8 -*-
"""
Created on Thu Feb 18 13:59:05 2021

@author: prite
"""

import pandas as pd
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


def label_credential_type(row: pd.Series):
    # Certification
    official_name : str = row['OFFICIALNAME']

    if row['LEADTOLICENSE'] == "1" and row['LEADTOINDUSTRYCREDENTIAL'] == "0":
        return 'License'

    if 'M.' in official_name and 'Master' in row['DEGREEAWARDEDNAME']:
        return 'Masters Degree'

    if 'A.S.' in official_name:
        return 'Associate Degree'

    ESL_NAME_TOKENS = { 'ESL', 'English as a Second Language'}
    if any(map(official_name.__contains__, ESL_NAME_TOKENS)):
        return 'ESL'

    if 'High School Diploma - Adults' in official_name:
        return 'Secondary School Diploma'

    if 'Apprentice' in official_name and 'Pre-Apprentice' not in official_name:
        return 'Apprenticeship'

    if 'Pre-Apprentice' in official_name:
        return 'Pre-Apprenticeship'

    GED_NAME_TOKENS = { 'GED', 'General Education Diploma', 'High School Equivalence', 'High School Equivalency'}
    if any(map(official_name.__contains__, GED_NAME_TOKENS)):
        return 'General Education Diploma (GED)'

    if (row['LEADTOINDUSTRYCREDENTIAL'] == "1"):
        return 'Certification'

    return 'Certificate of Completion'


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
    # add Credential Types
    programs_df['CREDENTIALTYPE'] = programs_df.apply(label_credential_type, axis=1)
    # export to csv
    export(programs_df, yyyymmdd)


if __name__ == '__main__':
    main()
