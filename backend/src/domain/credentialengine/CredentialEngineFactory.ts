import { GetAllCertificates } from "../types";
import { Certificates } from "./CredentialEngineInterface";
import { api } from "./CredentialEngineConfig";

export const credentialEngineFactory = (): GetAllCertificates => {
  return async (
    skip: number,
    take: number,
    sort: string,
    // cancel: boolean
  ): Promise<Certificates> => {
    const gateway = `/assistant/search/ctdl`;

    const response = await api.request({
      url: `${gateway}`,
      method: "POST",
      data: {
        Query: {
          "@type": [
            "ceterms:ApprenticeshipCertificate",
            "ceterms:AssociateDegree",
            "ceterms:BachelorDegree",
            "ceterms:Badge",
            "ceterms:Certificate",
            "ceterms:CertificateOfCompletion",
            "ceterms:Certification",
            "ceterms:Degree",
            "ceterms:DigitalBadge",
            "ceterms:Diploma",
            "ceterms:DoctoralDegree",
            "ceterms:GeneralEducationDevelopment",
            "ceterms:JourneymanCertificate",
            "ceterms:License",
            "ceterms:MasterCertificate",
            "ceterms:MasterDegree",
            "ceterms:MicroCredential",
            "ceterms:OpenBadge",
            "ceterms:ProfessionalDoctorate",
            "ceterms:QualityAssuranceCredential",
            "ceterms:ResearchDoctorate",
            "ceterms:SecondarySchoolDiploma"
          ],
          "ceterms:requires": {
            "ceterms:targetAssessment": {
              "ceterms:availableOnlineAt": "search:anyValue",
              "ceterms:availableAt": {
                "ceterms:addressRegion": [
                  "New Jersey",
                  "NJ"
                ]
              },
              "search:operator": "search:orTerms"
            }
          }
        },
        Skip: skip,
        Take: take,
        Sort: sort,
      },
      // retrieving the signal value by using the property name
      // signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
    });

    return response.data;
  };
};
