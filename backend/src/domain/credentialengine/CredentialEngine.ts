// To parse this data:
//
//   import { Convert, CTDLResource } from "./file";
//
//   const cTDLResource = Convert.toCTDLResource(json);

export interface CTDLResource {
  "@id"?:                          string;
  "@type"?:                        string;
  "ceterms:ctid"?:                 string;
  "ceterms:name"?:                 Ceterms;
  "ceterms:image"?:                string;
  "ceterms:naics"?:                string[];
  "ceterms:keyword"?:              CetermsKeyword;
  "ceterms:ownedBy"?:              string[];
  "ceterms:subject"?:              CetermsSubject[];
  "ceterms:requires"?:             CetermsRequire[];
  "ceterms:offeredBy"?:            string[];
  "ceterms:inLanguage"?:           string[];
  "ceterms:description"?:          Ceterms;
  "ceterms:industryType"?:         CetermsIndustryType[];
  "ceterms:dateEffective"?:        Date;
  "ceterms:estimatedCost"?:        CetermsEstimatedCost[];
  "ceterms:occupationType"?:       CetermsOccupationType[];
  "ceterms:subjectWebpage"?:       string;
  "ceterms:copyrightHolder"?:      string[];
  "ceterms:audienceLevelType"?:    CetermsType[];
  "ceterms:availableOnlineAt"?:    string[];
  "ceterms:credentialStatusType"?: CetermsType;
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

export interface CetermsEstimatedCost {
  "@type"?:                  string;
  "ceterms:name"?:           Ceterms;
  "ceterms:price"?:          number;
  "ceterms:currency"?:       string;
  "ceterms:costDetails"?:    string;
  "ceterms:description"?:    Ceterms;
  "ceterms:directCostType"?: CetermsType;
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

// Converts JSON strings to/from your types
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
