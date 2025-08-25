export const mockCredentialEngineApiData = [
  {
    "ceterms:ownedBy": "someCtid1",
    "ceterms:subjectWebpage": "someurl",
    "ceterms:address": [
      {
        "@type": "ceterms:Place",
        "ceterms:streetAddress": {
          "en-US": "1234 Test St"
        },
        "ceterms:addressLocality": {
          "en-US": "Test City"
        },
        "ceterms:addressRegion": {
          "en-US": "Test State"
        },
        "ceterms:postalCode": "07004",
        "ceterms:targetContactPoint": null
      }
    ],
    "ceterms:availableAt": [
      {"@type": "ceterms:Place",
        "ceterms:postalCode": "08816",
        "ceterms:addressRegion": { "en-US": "New Jersey" },
        "ceterms:streetAddress": { "en-US": "112 Rues Lane" },
        "ceterms:addressLocality": { "en-US": "East Brunswick" }}
    ],
    "ceterms:availableOnlineAt": "http://example.com",
    "ceterms:commonConditions": ["condition1"],
    "ceterms:estimatedCost": [
      {
        "ceterms:currency": "US Dollar",
        "ceterms:price": 1000
      }
    ],
    "ceterms:estimatedDuration": [
      {
        "ceterms:exactDuration": "P1Y"
      }
    ],
    "ceterms:instructionalProgramType": [
      {
        "ceterms:frameworkName": {
          "en-US": "Classification of Instructional Programs"
        },
        "ceterms:codedNotation": "12.3456"
      }
    ],
    "ceterms:isPreparationFor": [
      {
        "ceterms:name": {
          "en-US": "Certification Name"
        },
        "ceterms:experience": "2 years",
        "ceterms:description": {
          "en-US": "Description of the certification"
        },
        "ceterms:targetAssessment": ["assessment1"],
        "ceterms:targetCompetency": ["competency1"],
        "ceterms:targetCredential": ["credential1"],
        "ceterms:targetLearningOpportunity": ["learningOpportunity1"]
      }
    ],
    "ceterms:occupationType": [
      {
        "ceterms:codedNotation": "15-1121",
        "ceterms:targetNodeName" : {
          "en-US": "Software Engineer"
        }
      }
    ],
    "ceterms:scheduleTimingType": [
      {
        "ceterms:name": "Evening"
      }
    ],
    "ceterms:ctid": "ctid123",
    "ceterms:name": {
      "en-US": "Example Training Program"
    },
    "ceterms:description": {
      "en-US": "This is an example description for the training program."
    },
    "ceterms:requires": [
      {
        "ceterms:name": {
          "en-US": "Requirements"
        },
        "ceterms:description": {
          "en-US": "Example requirement description"
        }
      }
    ],
    "ceterms:inLanguage": ["English"]
  },
  {
    "ceterms:ownedBy": "someCtid2",
    "ceterms:subjectWebpage": "someurl",
    "ceterms:address": [
      {
        "@type": "ceterms:Place",
        "ceterms:streetAddress": {
          "en-US": "1234 Test St"
        },
        "ceterms:addressLocality": {
          "en-US": "Test City"
        },
        "ceterms:addressRegion": {
          "en-US": "Test State"
        },
        "ceterms:postalCode": "07735",
        "ceterms:targetContactPoint": null
      }
    ],
    "ceterms:availableOnlineAt": "http://example.com",
    "ceterms:commonConditions": ["condition2"],
    "ceterms:estimatedCost": [
      {
        "ceterms:currency": "US Dollar",
        "ceterms:price": 1000
      }
    ],
    "ceterms:estimatedDuration": [
      {
        "ceterms:exactDuration": "P1Y"
      }
    ],
    "ceterms:instructionalProgramType": [
      {
        "ceterms:frameworkName": {
          "en-US": "Cost Type"
        },
        "ceterms:targetNodeName": {
          "en-US": "Aggregate Cost"
        },
        "ceterms:targetNodeDescription": {
          "en-US": "Sum of direct costs."
        }
      }
    ],
    "ceterms:occupationType": [
      {
        "@type": "ceterms:CredentialAlignmentObject",
        "ceterms:framework": "https://www.onetcenter.org/taxonomy.html",
        "ceterms:targetNode": "https://www.onetonline.org/link/summary/11-3021.00",
        "ceterms:codedNotation": "11-3021.00",
        "ceterms:frameworkName": {
          "en-US": "Standard Occupational Classification"
        },
        "ceterms:targetNodeName": {
          "en-US": "Computer and Information Systems Managers"
        },
        "ceterms:targetNodeDescription": {
          "en-US": "Plan, direct, or coordinate activities in such fields as electronic data processing, information systems, systems analysis, and computer programming."
        }
      }
    ]
  }
]
