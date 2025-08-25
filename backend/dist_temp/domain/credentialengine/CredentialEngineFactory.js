"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialEngineFactory = void 0;
const tslib_1 = require("tslib");
const CredentialEngineConfig_1 = require("./CredentialEngineConfig");
const credentialEngineFactory = () => {
    return (skip, take, sort) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const gateway = `/assistant/search/ctdl`;
        const response = yield CredentialEngineConfig_1.api.request({
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
        });
        return response.data;
    });
};
exports.credentialEngineFactory = credentialEngineFactory;
