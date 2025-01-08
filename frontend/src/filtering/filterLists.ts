export const COUNTIES = [
  "Atlantic",
  "Bergen",
  "Burlington",
  "Camden",
  "Cape May",
  "Cumberland",
  "Essex",
  "Gloucester",
  "Hudson",
  "Hunterdon",
  "Mercer",
  "Middlesex",
  "Monmouth",
  "Morris",
  "Ocean",
  "Passaic",
  "Salem",
  "Somerset",
  "Sussex",
  "Union",
  "Warren",
];

export type CountyProps = "Atlantic" | "Bergen" | "Burlington" | "Camden" | "Cape May" | "Cumberland" | "Essex" | "Gloucester" | "Hudson" | "Hunterdon" | "Mercer" | "Middlesex" | "Monmouth" | "Morris" | "Ocean" | "Passaic" | "Salem" | "Somerset" | "Sussex" | "Union" | "Warren";

export const getCountyName = (county: string): string =>
  county.substring(0, county.lastIndexOf(" "));

export const languageList = [
  {
    id: "Arabic",
    label: "Arabic"
  },
  {
    id: "Chinese",
    label: "Chinese"
  },
  {
    id: "French",
    label: "French"
  },
  {
    id: "French Creole",
    label: "French Creole"
  },
  {
    id: "German",
    label: "German"
  },
  {
    id: "Greek",
    label: "Greek"
  },
  {
    id: "Hebrew",
    label: "Hebrew"
  },
  {
    id: "Hindi",
    label: "Hindi"
  },
  {
    id: "Hungarian",
    label: "Hungarian"
  },
  {
    id: "Italian",
    label: "Italian"
  },
  {
    id: "Japanese",
    label: "Japanese"
  },
  {
    id: "Korean",
    label: "Korean"
  },
  {
    id: "Polish",
    label: "Polish"
  },
  {
    id: "Portuguese",
    label: "Portuguese"
  },
  {
    id: "Russian",
    label: "Russian"
  },
  {
    id: "Spanish",
    label: "Spanish"
  },
  {
    id: "Tagalog",
    label: "Tagalog"
  },
  {
    id: "Vietnamese",
    label: "Vietnamese"
  }
];

export type LanguageProps = "Arabic" | "Chinese" | "French" | "French Creole" | "German" | "Greek" | "Hebrew" | "Hindi" | "Hungarian" | "Italian" | "Japanese" | "Korean" | "Polish" | "Portuguese" | "Russian" | "Spanish" | "Tagalog" | "Vietnamese";

export const serviceList = [
  {
    id: "wheelchair",
    label: "Wheelchair Accessible"
  },
  {
    id: "childcare",
    label: "Childcare Assistance"
  },
  {
    id: "evening",
    label: "Offers Evening Hours"
  },
  {
    id: "placement",
    label: "Job Placement Assistance"
  }
]

export type ServiceProps = "wheelchair" | "childcare" | "evening" | "placement";

export const completeInList = [
  {
    id: "days",
    label: "Days",
    values: [1, 2, 3]
  },
  {
    id: "weeks",
    label: "Weeks",
    values: [4, 5]
  },
  {
    id: "months",
    label: "Months",
    values: [6, 7]
  },
  {
    id: "years",
    label: "Years",
    values: [8, 9, 10]
  }
]

export type CompleteInProps = "days" | "weeks" | "months" | "years";

export const classFormatList = [
  {
    id: "online",
    label: "Online"
  },
  {
    id: "inperson",
    label: "In Person"
  },
  {
    id: "blended",
    label: "Blended"
  },
]

export type ClassFormatProps = "online" | "inperson";
