// To parse this data:
//
//   import { Convert, CTDLResource } from "./file";
//
//   const cTDLResource = Convert.toCTDLResource(json);

export interface CTDLResource {
  "@id":                                  string;
  "@type"?:                               string;
  "ceterms:ctid"?:                        string;
  "ceterms:name"?:                        Ceterms;
  "ceterms:image"?:                       string;
  "ceterms:naics"?:                       string[];
  "ceterms:isicV4"?:                      string;
  "ceterms:hasPart"?:                     string[];
  "ceterms:keyword"?:                     CetermsKeyword;
  "ceterms:ownedBy"?:                     string[];
  "ceterms:renewal"?:                     CetermsRenewal[]
  "ceterms:renewalFrequency"?:            string;
  "ceterms:processStandards"?:            string;
  "ceterms:subject"?:                     CetermsCredentialAlignmentObject[];
  "ceterms:requires"?:                    CetermsRequire[];
  "ceterms:offeredBy"?:                   string[];
  "ceterms:renewedBy"?:                   string[];
  "ceterms:approvedBy"?:                  string[];
  "ceterms:revokedBy"?:                   string[];
  "ceterms:address"?:                     CetermsPlace[];
  "ceterms:availableAt"?:                 CetermsPlace[];
  "ceterms:degreeMajor"?:                 CetermsCredentialAlignmentObject[];
  "ceterms:degreeMinor"?:                 CetermsCredentialAlignmentObject[];
  "ceterms:inLanguage"?:                  string[];
  "ceterms:recommends"?:                  CetermsConditionProfile[];
  "ceterms:revocation"?:                  CetermsRecovationProfile[];
  "ceterms:supersedes"?:                  string;
  "ceterms:creditValue"?:                 CetermsCreditValue[];
  "ceterms:creditUnitTypeDescription"?:   Ceterms;
  "ceterms:targetLearningOpportunity"?:   string[];
  "ceterms:description"?:                 Ceterms;
  "ceterms:nextVersion"?:                 string;
  "ceterms:regulatedBy"?:                 string[];
  "ceterms:isNonCredit"?:                 boolean;
  "ceterms:prerequisite"?:                string[];
  "ceterms:deliveryType"?:                CetermsDeliveryType[];
  "ceterms:accreditedBy"?:                string[];
  "ceterms:audienceType"?:                CetermsCredentialAlignmentObject[];
  "ceterms:credentialId"?:                string;
  "ceterms:industryType"?:                CetermsCredentialAlignmentObject[];
  "ceterms:jurisdiction"?:                CetermsPlace[];
  "ceterms:alternateName"?:               CetermsAlternateName;
  "ceterms:dateEffective"?:               Date;
  "ceterms:estimatedCost"?:               CetermsEstimatedCost[];
  "ceterms:directCost"?:                  CetermsDirectCostType[];
  "ceterms:entryCondition"?:              CetermsEntryCondition[];
  "ceterms:occupationType"?:              CetermsCredentialAlignmentObject[];
  "ceterms:subjectWebpage"?:              string;
  "ceterms:commonConditions"?:            string[];
  "ceterms:isPreparationFor"?:            CetermsConditionProfile[];
  "ceterms:isRequiredFor"?:               CetermsConditionProfile[];
  "ceterms:copyrightHolder"?:             string[];
  "ceterms:audienceLevelType"?:           CetermsCredentialAlignmentObject[];
  "ceterms:availableOnlineAt"?:           string[];
  "ceterms:estimatedDuration"?:           CetermsEstimatedDuration[];
  "ceterms:targetAssessment"?:            string[];
  "ceterms:learningMethodType"?:          CetermsLearningMethodType[];
  "ceterms:financialAssistance"?:         CetermsFinancialAssistance[];
  "ceterms:lifeCycleStatusType"?:         CetermsLifeCycleStatusType;
  "ceterms:targetLearningResource"?:      string[];
  "ceterms:deliveryTypeDescription"?:     Ceterms;
  "ceterms:versionIdentifier"?:           CetermsVersionIdentifier[];
  "ceterms:availabilityListing"?:         string[];
  "ceterms:degreeConcentration"?:         CetermsCredentialAlignmentObject[];
  "ceterms:credentialStatusType"?:        CetermsCredentialAlignmentObject;
  "ceterms:learningDeliveryType"?:        CetermsCredentialAlignmentObject[];
  "ceterms:assessmentDeliveryType"?:      CetermsCredentialAlignmentObject[];
  "ceterms:instructionalProgramType"?:    CetermsInstructionalProgramType[];
  "ceterms:offerFrequencyType"?:          CetermsOfferFrequencyType[];
  "ceterms:scheduleTimingType"?:          CetermsScheduleTimingType[];
  "ceterms:scheduleFrequencyType"?:       CetermsScheduleFrequencyType[];
  "ceterms:processStandardsDescription"?: Ceterms;
  "ceterms:latestVersion"?:               string;
  "ceterms:aggregateData"?:               CetermsAggregateData[];
  "ceterms:hasSupportService"?:           string[];
}

export interface Ceterms {
  "en-US"?: string;
}

export interface CetermsCreditValue {
  "@type"?:                   string;
  "schema:value"?:            number;
  "ceterms:subject"?:         CetermsCredentialAlignmentObject[];
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
  "ceterms:directCostType"?: CetermsCredentialAlignmentObject;
}

export interface CetermsDirectCostType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeName"?:        CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeDescription"?: CetermsCreditUnitTypeDescription;
}

export interface CetermsJurisdictionProfile {
  "@type"?:                           string;
  "ceterms:description"?:             Ceterms;
  "ceterms:mainJurisdiction"?:        CetermsPlace[];
  "ceterms:globalJurisdiction"?:      boolean;
  "ceterms:jurisdictionExceiption"?:  CetermsPlace

}

export interface CetermsPlace {
  "@type"?:                       string;
  "ceterms:name"?:                Ceterms;
  "ceterms:geoURI"?:              string;
  "ceterms:latitude"?:            number;
  "ceterms:longitude"?:           number;
  "ceterms:streetAddress"?:       Ceterms;
  "ceterms:postOfficeBoxNumber"?: string;
  "ceterms:addressLocality"?:     Ceterms;
  "ceterms:addressRegion"?:       Ceterms;
  "ceterms:postalCode"?:          string;
  "ceterms:addressCountry"?:      Ceterms;
  "ceterms:targetContactPoint"?:  CetermsContactPoint[];
}

export interface CetermsContactPoint {
  "@type"?:                       string;
  "ceterms:name"?:                Ceterms;
  "ceterms:alernateName"?:        Ceterms;
  "ceterms:email"?:               string[];
  "ceterms:telephone"?:           string[];
  "ceterms:faxNumber"?:           string[];
  "ceterms:contactType?":         Ceterms;
  "ceterms:socialMedia?":         string[];
}

export interface CetermsKeyword {
  "en-US"?: string[];
}

export interface CetermsRenewal {
  "@type"?:                           string;
  "ceterms:name"?:                    Ceterms;
  "ceterms:condition"?:               CetermsCondition;
  "ceterms:assertedBy"?:              string[];
  "ceterms:creditValue"?:             CetermsCreditValue[];
  "ceterms:description"?:             Ceterms;
  "ceterms:audienceType"?:            CetermsCredentialAlignmentObject[];
  "ceterms:audienceLevelType"?:       CetermsCredentialAlignmentObject[];
  "ceterms:submissionOfDescription"?: Ceterms;
}

export interface CetermsCredentialAlignmentObject {
  "@type"?:                         string;
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
  "ceterms:alternativeCondition"?:      CetermsCondition[]
  "ceterms:subjectWebpage"?:            string;
  "ceterms:targetAssessment"?:          string[];
  "ceterms:targetCompetency"?:          CetermsCredentialAlignmentObject[];
  "ceterms:targetLearningOpportunity"?: string[];
}

export interface CetermsVersionIdentifier {
  "@type"?:                       string;
  "ceterms:identifierTypeName"?:  Ceterms;
  "ceterms:identifierValueCode"?: string;
}

export interface CetermsConditionProfile {
  "@type"?:                             string;
  "ceterms:name"?:                      Ceterms;
  "ceterms:assertedBy"?:                string[];
  "ceterms:experience"?:                string;
  "ceterms:description"?:               Ceterms;
  "ceterms:yearsofExperience"?:         number;
  "ceterms:targetAssessment"?:          string[];
  "ceterms:targetCompetency"?:          string[];
  "ceterms:targetCredential"?:          string[];
  "ceterms:targetLearningOpportunity"?: string[];
}

export interface CetermsRecovationProfile {
  "@type"?:                                 string;
  "ceterms:description"?:                   Ceterms;
  "ceterms:jurisdiction"?:                  CetermsJurisdictionProfile;
  "ceterms:dateEffective"?:                 string;
  "ceterms:revocationCriteria"?:            string;
  "ceterms:revocationCriteriaDescription?": Ceterms;
}

export interface CetermsAggregateData {
  "@type"?:                                 string;
  "ceterms:name"?:                          Ceterms;
  "ceterms:source"?:                        string;
  "ceterms:description"?:                   Ceterms;
  "ceterms:dateEffective"?:                 string;
  "ceterms:jobsObtained"?:                  JobsObtained[];
  "ceterms:currency"?:                      string;
  "ceterms:medianEarnings"?:                number;
  "ceterms:postReceiptMonths"?:             number;
}

export interface JobsObtained  {
  "@type"?:                                 string;
  "qdata:percentage"?:                      number;
  "schema:description"?:                    Ceterms;
}

export interface CtermsSupportServices {
  "@type"?:                                 string;
  "ceterms:accommodationType"?:             CetermsAccommodationType[];
  "ceterms:supportServiceType"?:            CetermsServiceType[];
}

export interface CetermsAccommodationType {
  "@type"?:                                  string;
  "ceterms:framework"?:                      string;
  "ceterms:targetNode"?:                     string;
  "ceterms:codedNotation"?:                  string;
  "ceterms:frameworkName"?:                  Ceterms;
  "ceterms:targetNodeName"?:                 Ceterms;
  "ceterms:targetNodeDescription"?:          Ceterms;
}
export interface CetermsServiceType {
  "@type"?:                                  string;
  "ceterms:framework"?:                      string;
  "ceterms:targetNode"?:                     string;
  "ceterms:codedNotation"?:                  string;
  "ceterms:frameworkName"?:                  Ceterms;
  "ceterms:targetNodeName"?:                 Ceterms;
  "ceterms:targetNodeDescription"?:          Ceterms;
}
