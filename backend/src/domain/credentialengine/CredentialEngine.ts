// To parse this data:
//
//   import { Convert, CTDLResource } from "./file";
//
//   const cTDLResource = Convert.toCTDLResource(json);

export interface CTDLResource {
  "@id":                                string;
  "@type"?:                             string;
  "ceterms:ctid"?:                      string;
  "ceterms:name"?:                      Ceterms;
  "ceterms:image"?:                     string;
  "ceterms:naics"?:                     string[];
  "ceterms:keyword"?:                   CetermsKeyword;
  "ceterms:ownedBy"?:                   string[];
  "ceterms:subject"?:                   CetermsSubject[];
  "ceterms:requires"?:                  CetermsRequire[];
  "ceterms:offeredBy"?:                 string[];
  "ceterms:revokedBy"?:                 string[];
  "ceterms:availableAt"?:               CetermsAvailableAt[];
  "ceterms:degreeMajor"?:               CetermsDegree[];
  "ceterms:inLanguage"?:                string[];
  "ceterms:creditValue"?:               CetermsCreditValue[];
  "ceterms:creditUnitTypeDescription"?: Ceterms;
  "ceterms:targetLearningOpportunity"?: string[];
  "ceterms:description"?:               Ceterms;
  "ceterms:isNonCredit"?:               boolean;
  "ceterms:prerequisite"?:              string[];
  "ceterms:deliveryType"?:              CetermsDeliveryType[];
  "ceterms:accreditedBy"?:              string[];
  "ceterms:audienceType"?:              CetermsType[];
  "ceterms:industryType"?:              CetermsIndustryType[];
  "ceterms:jurisdiction"?:              CetermsJurisdiction[];
  "ceterms:alternateName"?:             CetermsAlternateName;
  "ceterms:dateEffective"?:             Date;
  "ceterms:estimatedCost"?:             CetermsEstimatedCost[];
  "ceterms:directCost"?:                CetermsDirectCostType[];
  "ceterms:entryCondition"?:            CetermsEntryCondition[];
  "ceterms:occupationType"?:            CetermsOccupationType[];
  "ceterms:subjectWebpage"?:            string;
  "ceterms:copyrightHolder"?:           string[];
  "ceterms:audienceLevelType"?:         CetermsType[];
  "ceterms:availableOnlineAt"?:         string[];
  "ceterms:estimatedDuration"?:         CetermsEstimatedDuration[];
  "ceterms:targetAssessment"?:          string[];
  "ceterms:learningMethodType"?:        CetermsLearningMethodType[];
  "ceterms:financialAssistance"?:       CetermsFinancialAssistance[];
  "ceterms:lifeCycleStatusType"?:       CetermsLifeCycleStatusType;
  "ceterms:targetLearningResource"?:    string[];
  "ceterms:deliveryTypeDescription"?:   Ceterms;
  "ceterms:versionIdentifier"?:         CetermsVersionIdentifier[];
  "ceterms:availabilityListing"?:       string[];
  "ceterms:degreeConcentration"?:       CetermsDegree[];
  "ceterms:credentialStatusType"?:      CetermsType;
  "ceterms:learningDeliveryType"?:      CetermsType[];
  "ceterms:assessmentDeliveryType"?:    CetermsType[];
  "ceterms:instructionalProgramType"?:  CetermsInstructionalProgramType[];
  "ceterms:offerFrequencyType"?:        CetermsOfferFrequencyType[];
  "ceterms:scheduleTimingType"?:        CetermsScheduleTimingType[];
  "ceterms:scheduleFrequencyType"?:     CetermsScheduleFrequencyType[];
}

export interface CetermsType {
  "@type"?:                         Type;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

export enum Type {
  CetermsCredentialAlignmentObject = "ceterms:CredentialAlignmentObject",
}

export interface Ceterms {
  "en-US"?: string;
}

export interface CetermsCreditValue {
  "@type"?:                   string;
  "schema:value"?:            number;
  "ceterms:subject"?:         CetermsSubject[];
  "schema:description"?:      CetermsCreditUnitTypeDescription;
  "ceterms:creditUnitType"?:  CetermsCreditUnitType[];
  "schema:maxValue"?:         number;
  "schema:minValue"?:         number;
  "qdata:percentage"?:        number;
  "ceterms:creditLevelType"?: CetermsCreditLevelType[];
}

export interface CetermsDeliveryType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

export interface CetermsEntryCondition {
  "@type"?:               string;
  "ceterms:condition"?:   CetermsCondition;
  "ceterms:description"?: Ceterms;
}

export interface CetermsCondition {
  "en-US"?: string[];
}

export interface CetermsAlternateName {
  "en-US"?: string[];
}

export interface CetermsAvailableAt {
  "@type"?:                   string;
  "ceterms:name"?:            Ceterms;
  "ceterms:latitude"?:        number;
  "ceterms:longitude"?:       number;
  "ceterms:postalCode"?:      string;
  "ceterms:addressRegion"?:   Ceterms;
  "ceterms:streetAddress"?:   Ceterms;
  "ceterms:addressCountry"?:  Ceterms;
  "ceterms:addressLocality"?: Ceterms;
}

export interface CetermsCreditUnitType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeName"?:        CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeDescription"?: CetermsCreditUnitTypeDescription;
}

export interface CetermsCreditLevelType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeName"?:        CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeDescription"?: CetermsCreditUnitTypeDescription;
}

export interface CetermsCreditUnitTypeDescription {
  "en-US"?: string;
}

export interface CetermsDegree {
  "@type"?:                  string;
  "ceterms:targetNodeName"?: Ceterms;
}

export interface CetermsEstimatedDuration {
  "@type"?:                   string;
  "ceterms:description"?:     Ceterms;
  "ceterms:exactDuration"?:   string;
  "ceterms:maximumDuration"?: string;
  "ceterms:minimumDuration"?: string;
}

export interface CetermsFinancialAssistance {
  "@type"?:                           string;
  "ceterms:name"?:                    Ceterms;
  "ceterms:financialAssistanceType"?: CetermsFinancialAssistanceType[];
  "ceterms:description"?:             Ceterms;
}

export interface CetermsFinancialAssistanceType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

export interface CetermsEstimatedCost {
  "@type"?:                  string;
  "ceterms:name"?:           Ceterms;
  "ceterms:price"?:          number;
  "ceterms:currency"?:       string;
  "ceterms:costDetails"?:    string;
  "ceterms:description"?:    Ceterms;
  "ceterms:directCostType"?: CetermsType;
}

export interface CetermsDirectCostType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeName"?:        CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeDescription"?: CetermsCreditUnitTypeDescription;
}

export interface CetermsIndustryType {
  "@type"?:                         Type;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:codedNotation"?:         string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

export interface CetermsJurisdiction {
  "@type"?:                      string;
  "ceterms:mainJurisdiction"?:   CetermsMainJurisdiction[];
  "ceterms:globalJurisdiction"?: boolean;
}

export interface CetermsMainJurisdiction {
  "@type"?:                  string;
  "ceterms:geoURI"?:         string;
  "ceterms:latitude"?:       number;
  "ceterms:longitude"?:      number;
  "ceterms:addressCountry"?: Ceterms;
}

export interface CetermsKeyword {
  "en-US"?: string[];
}

export interface CetermsOccupationType {
  "@type"?:                         Type;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:codedNotation"?:         string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

export interface CetermsInstructionalProgramType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:codedNotation"?:         string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

export interface CetermsLearningMethodType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

export interface CetermsLifeCycleStatusType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

export interface CetermsFrameworkNameClass {
  "en-US"?: string;
}

export interface CetermsOfferFrequencyType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         CetermsFrameworkNameClass;
  "ceterms:targetNodeName"?:        CetermsFrameworkNameClass;
  "ceterms:targetNodeDescription"?: CetermsFrameworkNameClass;
}

export interface CetermsScheduleFrequencyType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         CetermsFrameworkNameClass;
  "ceterms:targetNodeName"?:        CetermsFrameworkNameClass;
  "ceterms:targetNodeDescription"?: CetermsFrameworkNameClass;
}

export interface CetermsScheduleTimingType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         CetermsFrameworkNameClass;
  "ceterms:targetNodeName"?:        CetermsFrameworkNameClass;
  "ceterms:targetNodeDescription"?: CetermsFrameworkNameClass;
}

export interface CetermsRequire {
  "@type"?:                             string;
  "ceterms:name"?:                      Ceterms;
  "ceterms:assertedBy"?:                string[];
  "ceterms:experience"?:                Ceterms;
  "ceterms:description"?:               Ceterms;
  "ceterms:subjectWebpage"?:            string;
  "ceterms:targetAssessment"?:          string[];
  "ceterms:targetLearningOpportunity"?: string[];
}

export interface CetermsSubject {
  "@type"?:                  Type;
  "ceterms:targetNodeName"?: Ceterms;
}

export interface CetermsVersionIdentifier {
  "@type"?:                       string;
  "ceterms:identifierTypeName"?:  Ceterms;
  "ceterms:identifierValueCode"?: string;
}

export class Convert {
  public static toCTDLResource(json: string): CTDLResource {
    return JSON.parse(json);
  }

  public static cTDLResourceToJson(value: CTDLResource): string {
    return JSON.stringify(value);
  }

  public static toCetermsType(json: string): CetermsType {
    return JSON.parse(json);
  }

  public static cetermsTypeToJson(value: CetermsType): string {
    return JSON.stringify(value);
  }

  public static toCeterms(json: string): Ceterms {
    return JSON.parse(json);
  }

  public static cetermsToJson(value: Ceterms): string {
    return JSON.stringify(value);
  }

  public static toCetermsEstimatedCost(json: string): CetermsEstimatedCost {
    return JSON.parse(json);
  }

  public static cetermsEstimatedCostToJson(value: CetermsEstimatedCost): string {
    return JSON.stringify(value);
  }

  public static toCetermsIndustryType(json: string): CetermsIndustryType {
    return JSON.parse(json);
  }

  public static cetermsIndustryTypeToJson(value: CetermsIndustryType): string {
    return JSON.stringify(value);
  }

  public static toCetermsKeyword(json: string): CetermsKeyword {
    return JSON.parse(json);
  }

  public static cetermsKeywordToJson(value: CetermsKeyword): string {
    return JSON.stringify(value);
  }

  public static toCetermsOccupationType(json: string): CetermsOccupationType {
    return JSON.parse(json);
  }

  public static cetermsOccupationTypeToJson(value: CetermsOccupationType): string {
    return JSON.stringify(value);
  }

  public static toCetermsRequire(json: string): CetermsRequire {
    return JSON.parse(json);
  }

  public static cetermsRequireToJson(value: CetermsRequire): string {
    return JSON.stringify(value);
  }

  public static toCetermsSubject(json: string): CetermsSubject {
    return JSON.parse(json);
  }

  public static cetermsSubjectToJson(value: CetermsSubject): string {
    return JSON.stringify(value);
  }
}
