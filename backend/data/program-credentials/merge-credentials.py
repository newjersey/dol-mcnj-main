# -*- coding: utf-8 -*-
"""
Created on Thu Feb 18 13:59:05 2021

@author: prite
"""

import pandas as pd
import sys

def input_source(*args):
    df = {}
    for i in range(len(args[0])):
        df["df{0}".format(i)] = args[0][i]
    for j in df:
        if df[j].rsplit('.', 1)[1] == 'csv':
            df[j] = pd.read_csv(df[j])
        elif df[j].rsplit('.', 1)[1] in ('xls', 'xlsx'):
            df[j] = pd.read_excel(df[j])

    # print(df['df0'])
    return df


def mergedf(leftdf, rightdf, jointype, leftcol, rightcol):
    df = pd.merge(left=leftdf, right=rightdf, how=jointype, left_on=leftcol, right_on=rightcol)
    # drop all columns except NAME column
    rightdf = rightdf.loc[:, rightdf.columns != 'NAME']
    drop_list = rightdf.columns.values.tolist()
    df.drop(drop_list, axis=1, inplace=True)
    add_column = df.pop('NAME')
    return df, add_column


def addCredentials(maindf):
    df = maindf
    # new column credential type
    df['CREDENTIALTYPE'] = ''

    # replace special characters " and *
    df['OFFICIALNAME'] = df['OFFICIALNAME'].str.replace('[*,"]', '')
    df['OFFICIALNAME'] = df['OFFICIALNAME'].str.replace('AAS', 'A.A.S.')

    # Certification
    df.loc[df['LEADTOINDUSTRYCREDENTIAL'] == 1.0, 'CREDENTIALTYPE'] = 'Certification'

    # GED
    df.loc[df['OFFICIALNAME'].str.contains('GED'), 'CREDENTIALTYPE'] = 'General Education Diploma (GED)'
    df.loc[df['OFFICIALNAME'].str.contains(
        'General Education Diploma'), 'CREDENTIALTYPE'] = 'General Education Diploma (GED)'
    df.loc[df['OFFICIALNAME'].str.contains(
        'High School Equivalence'), 'CREDENTIALTYPE'] = 'General Education Diploma (GED)'
    df.loc[df['OFFICIALNAME'].str.contains(
        'High School Equivalency'), 'CREDENTIALTYPE'] = 'General Education Diploma (GED)'

    # Pre-Apprenticeship
    df.loc[df['OFFICIALNAME'].str.contains('Pre-Apprentice'), 'CREDENTIALTYPE'] = 'Pre-Apprenticeship'

    # Apprenticeship
    df.loc[(df['OFFICIALNAME'].str.contains('Apprentice')) & (
                df['CREDENTIALTYPE'] != 'Pre-Apprenticeship'), 'CREDENTIALTYPE'] = 'Apprenticeship'

    # Secondary School Diploma
    df.loc[df['OFFICIALNAME'].str.contains(
        'High School Diploma - Adults'), 'CREDENTIALTYPE'] = 'Secondary School Diploma'

    # ESL
    df.loc[df['OFFICIALNAME'].str.contains('ESL'), 'CREDENTIALTYPE'] = 'ESL'
    df.loc[df['OFFICIALNAME'].str.contains('English as a Second Language'), 'CREDENTIALTYPE'] = 'ESL'

    # Associate
    df.loc[df['OFFICIALNAME'].str.contains('A.S.', regex=False), 'CREDENTIALTYPE'] = 'Associate Degree'

    # Masters
    df.loc[(df['OFFICIALNAME'].str.contains('M.', regex=False)) & (
        df['DEGREEAWARDEDNAME'].str.contains('Master')), 'CREDENTIALTYPE'] = 'Masters Degree'

    # License
    df.loc[(df['LEADTOLICENSE'] == 1.0) & (
                df['LEADTOINDUSTRYCREDENTIAL'] == 0.0), 'CREDENTIALTYPE'] = 'License'

    # Certificate of Completion
    df.loc[df['CREDENTIALTYPE'] == '', 'CREDENTIALTYPE'] = 'Certificate of Completion'

    return df


def export(df, yyyymmdd):
    df.to_csv(f'../programs_{yyyymmdd}_merged.csv', index=False, encoding='utf-8-sig')


def main():
    print(sys.argv)
    yyyymmdd = sys.argv[1]
    from_filepath = f"../programs_{yyyymmdd}.csv"
    input_file1 = "./TBLDEGREELU_DATA_TABLE.csv"
    input_file2 = "./TBLINDUSTRYCREDENTIAL_DATA_TABLE.csv"
    input_file3 = "./TBLLICENSE_DATA_TABLE.csv"

    # create dataframes equivalent to number of files.
    files_list = [from_filepath, input_file1, input_file2, input_file3]
    mydf = input_source(files_list)
    maindf = mydf['df0']
    df1, df2, df3 = mydf['df1'], mydf['df2'], mydf['df3']

    # Remove private data from programs file
    maindf.drop(['SUBMITTERNAME', 'SUBMITTERTITLE'], axis=1, inplace=True)

    # merge degree
    leftcolslist = maindf.columns.values.tolist()
    rightcolslist = df1.columns.values.tolist()
    maindf, maindfcol = mergedf(maindf, df1, 'left', leftcolslist[15], rightcolslist[0])
    maindf.insert(16, 'NAME', maindfcol)
    maindf.rename(columns={maindf.columns[16]: "DEGREEAWARDEDNAME"}, inplace=True)

    # merge industry credential
    leftcolslist = maindf.columns.values.tolist()
    rightcolslist = df2.columns.values.tolist()
    maindf, maindfcol = mergedf(maindf, df2, 'left', leftcolslist[20], rightcolslist[0])
    maindf.insert(21, 'NAME', maindfcol)
    maindf.rename(columns={maindf.columns[21]: "INDUSTRYCREDENTIALNAME"}, inplace=True)

    # merge license
    leftcolslist = maindf.columns.values.tolist()
    rightcolslist = df3.columns.values.tolist()
    maindf, maindfcol = mergedf(maindf, df3, 'left', leftcolslist[18], rightcolslist[0])
    maindf.insert(19, 'NAME', maindfcol)
    maindf.rename(columns={maindf.columns[19]: "LICENSEAWARDEDNAME"}, inplace=True)

    # add Credential Types
    finaldf = addCredentials(maindf)
    # remove special characters " and * from officialname field
    # maindf['OFFICIALNAME'] = maindf['OFFICIALNAME'].str.replace('[*,"]', '')

    # export to csv
    export(finaldf, yyyymmdd)


if __name__ == '__main__':
    main()
