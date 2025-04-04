/**
 * Represents a Credential Transparency Description Language (CTDL) resource.
 * This interface defines the properties commonly found in a CTDL entity,
 * which can include credentials, assessments, providers learning opportunities, and more.
 *
 * Language documentation: https://credreg.net/ctdl/terms
 */

export interface CTDLResource {
  "@id": string; // Unique identifier for the CTDL resource
  "@type"?: string; // Type of CTDL entity (e.g., Credential, LearningOpportunity, Assessment)
  "ceterms:ctid"?: string; // CTID (Credential Transparency Identifier)
  "ceterms:name"?: Ceterms; // Name of the CTDL entity
  "ceterms:image"?: string; // URL of an image representing the entity
  "ceterms:naics"?: string[]; // NAICS industry classification codes
  "ceterms:isicV4"?: string; // ISIC V4 industry classification code
  "ceterms:hasPart"?: string[]; // Identifiers of related entities that form part of this entity
  "ceterms:keyword"?: CetermsKeyword; // Keywords describing the entity
  "ceterms:ownedBy"?: string[]; // Organizations that own this entity
  "ceterms:renewal"?: CetermsRenewal[]; // Renewal requirements
  "ceterms:renewalFrequency"?: string; // Frequency of renewal
  "ceterms:processStandards"?: string; // Description of process standards followed
  "ceterms:subject"?: CetermsCredentialAlignmentObject[]; // Subjects related to the entity
  "ceterms:requires"?: CetermsRequire[]; // Requirements for obtaining this entity
  "ceterms:offeredBy"?: string[]; // Organizations offering this entity
  "ceterms:renewedBy"?: string[]; // Organizations responsible for renewal
  "ceterms:approvedBy"?: string[]; // Organizations that approve this entity
  "ceterms:revokedBy"?: string[]; // Organizations that can revoke this entity
  "ceterms:address"?: CetermsPlace[]; // Addresses where this entity is available
  "ceterms:availableAt"?: CetermsPlace[]; // Locations where the entity is accessible
  "ceterms:degreeMajor"?: CetermsCredentialAlignmentObject[]; // Major subjects for degrees
  "ceterms:degreeMinor"?: CetermsCredentialAlignmentObject[]; // Minor subjects for degrees
  "ceterms:inLanguage"?: string[]; // Languages in which this entity is available
  "ceterms:recommends"?: CetermsConditionProfile[]; // Recommendations related to this entity
  "ceterms:revocation"?: CetermsRecovationProfile[]; // Revocation details
  "ceterms:supersedes"?: string; // Previous version of this entity
  "ceterms:creditValue"?: CetermsCreditValue[]; // Credit values associated with the entity
  "ceterms:creditUnitTypeDescription"?: Ceterms; // Description of credit unit type
  "ceterms:targetLearningOpportunity"?: string[]; // Related learning opportunities
  "ceterms:description"?: Ceterms; // Description of the entity
  "ceterms:nextVersion"?: string; // Next version of this entity
  "ceterms:regulatedBy"?: string[]; // Regulatory bodies governing this entity
  "ceterms:isNonCredit"?: boolean; // Whether the entity is non-credit
  "ceterms:prerequisite"?: string[]; // Prerequisites for accessing this entity
  "ceterms:deliveryType"?: CetermsDeliveryType[]; // Delivery types (e.g., online, in-person)
  "ceterms:accreditedBy"?: string[]; // Accrediting organizations
  "ceterms:audienceType"?: CetermsCredentialAlignmentObject[]; // Target audience types
  "ceterms:credentialId"?: string; // Credential identifier
  "ceterms:industryType"?: CetermsCredentialAlignmentObject[]; // Industry classifications
  "ceterms:jurisdiction"?: CetermsPlace[]; // Jurisdictions where this entity is applicable
  "ceterms:alternateName"?: CetermsAlternateName; // Alternative names for the entity
  "ceterms:dateEffective"?: Date; // Effective date
  "ceterms:estimatedCost"?: CetermsEstimatedCost[]; // Estimated costs
  "ceterms:directCost"?: CetermsDirectCostType[]; // Direct cost types
  "ceterms:entryCondition"?: CetermsEntryCondition[]; // Entry conditions
  "ceterms:occupationType"?: CetermsCredentialAlignmentObject[]; // Occupations associated with the entity
  "ceterms:subjectWebpage"?: string; // URL of the subject webpage
  "ceterms:commonConditions"?: string[]; // Common conditions for obtaining the entity
  "ceterms:isPreparationFor"?: CetermsConditionProfile[]; // Preparation for other entities
  "ceterms:isRequiredFor"?: CetermsConditionProfile[]; // Requirements for other entities
  "ceterms:copyrightHolder"?: string[]; // Copyright holders
  "ceterms:audienceLevelType"?: CetermsCredentialAlignmentObject[]; // Audience level types
  "ceterms:availableOnlineAt"?: string[]; // URLs where available online
  "ceterms:estimatedDuration"?: CetermsEstimatedDuration[]; // Estimated duration
  "ceterms:targetAssessment"?: string[]; // Related assessments
  "ceterms:learningMethodType"?: CetermsLearningMethodType[]; // Learning method types
  "ceterms:financialAssistance"?: CetermsFinancialAssistance[]; // Financial assistance options
  "ceterms:lifeCycleStatusType"?: CetermsLifeCycleStatusType; // Lifecycle status
  "ceterms:targetLearningResource"?: string[]; // Learning resources associated
  "ceterms:deliveryTypeDescription"?: Ceterms; // Description of delivery type
  "ceterms:versionIdentifier"?: CetermsVersionIdentifier[]; // Version identifiers
  "ceterms:availabilityListing"?: string[]; // Listings of availability
  "ceterms:degreeConcentration"?: CetermsCredentialAlignmentObject[]; // Degree concentrations
  "ceterms:credentialStatusType"?: CetermsCredentialAlignmentObject; // Credential status
  "ceterms:assessmentDeliveryType"?: CetermsCredentialAlignmentObject[]; // Assessment delivery types
  "ceterms:instructionalProgramType"?: CetermsInstructionalProgramType[]; // Instructional program types
  "ceterms:offerFrequencyType"?: CetermsOfferFrequencyType[]; // Offer frequency types
  "ceterms:scheduleTimingType"?: CetermsScheduleTimingType[]; // Schedule timing types
  "ceterms:scheduleFrequencyType"?: CetermsScheduleFrequencyType[]; // Schedule frequency types
  "ceterms:processStandardsDescription"?: Ceterms; // Description of process standards
  "ceterms:latestVersion"?: string; // Latest version
  "ceterms:aggregateData"?: CetermsAggregateData[]; // Aggregate data related to the entity
  "ceterms:hasSupportService"?: string[]; // Support services available
}

/**
 * Represents a localized string in the CTDL schema.
 * Typically used for properties that support multilingual content.
 */
export interface Ceterms {
  "en-US"?: string;
}

/**
 * Defines credit value details associated with an entity.
 */
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

/**
 * Represents delivery type information in CTDL.
 */
export interface CetermsDeliveryType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

/**
 * Represents conditions required for entry into a program or assessment.
 */
export interface CetermsEntryCondition {
  "@type"?:               string;
  "ceterms:condition"?:   CetermsCondition;
  "ceterms:description"?: Ceterms;
}

/**
 * Represents alternative conditions for entry requirements.
 */
export interface CetermsCondition {
  "en-US"?: string[];
}

/**
 * Represents an alternate name for an entity.
 */
export interface CetermsAlternateName {
  "en-US"?: string[];
}

/**
 * Represents a type of credit unit within the CTDL schema.
 */
export interface CetermsCreditUnitType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeName"?:        CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeDescription"?: CetermsCreditUnitTypeDescription;
}

/**
 * Represents a credit level type in CTDL.
 */
export interface CetermsCreditLevelType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeName"?:        CetermsCreditUnitTypeDescription;
  "ceterms:targetNodeDescription"?: CetermsCreditUnitTypeDescription;
}

/**
 * Provides a description for credit unit types.
 */
export interface CetermsCreditUnitTypeDescription {
  "en-US"?: string;
}

/**
 * Represents estimated duration details for a learning opportunity.
 */
export interface CetermsEstimatedDuration {
  "@type"?:                   string;
  "ceterms:description"?:     Ceterms;
  "ceterms:exactDuration"?:   string;
  "ceterms:maximumDuration"?: string;
  "ceterms:minimumDuration"?: string;
  "ceterms:timeRequired"?:    string;
}

/**
 * Represents financial assistance options available.
 */
export interface CetermsFinancialAssistance {
  "@type"?:                           string;
  "ceterms:name"?:                    Ceterms;
  "ceterms:financialAssistanceType"?: CetermsFinancialAssistanceType[];
  "ceterms:description"?:             Ceterms;
}

/**
 * Represents types of financial assistance within CTDL.
 */
export interface CetermsFinancialAssistanceType {
  "@type"?:                         string;
  "ceterms:framework"?:             string;
  "ceterms:targetNode"?:            string;
  "ceterms:frameworkName"?:         Ceterms;
  "ceterms:targetNodeName"?:        Ceterms;
  "ceterms:targetNodeDescription"?: Ceterms;
}

/**
 * Represents estimated cost information for a credential or program.
 */
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

/**
 * Represents details related to a jurisdiction profile.
 */
export interface CetermsJurisdictionProfile {
  "@type"?:                           string;
  "ceterms:description"?:             Ceterms;
  "ceterms:mainJurisdiction"?:        CetermsPlace[];
  "ceterms:globalJurisdiction"?:      boolean;
  "ceterms:jurisdictionExceiption"?:  CetermsPlace

}

/**
 * Represents a location associated with a credential, assessment, or organization.
 */
export class CetermsPlace {
  "@type" = "ceterms:Place";
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

  constructor(init?: Partial<CetermsPlace>) {
    Object.assign(this, init);
  }
}

export interface CetermsContactPoint {
  "@type"?:                       string;
  "ceterms:name"?:                Ceterms;
  "ceterms:alernateName"?:        Ceterms;
  "ceterms:email"?:               string[];
  "ceterms:telephone"?:           string[];
  "ceterms:faxNumber"?:           string[];
  "ceterms:contactType":         Ceterms;
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
