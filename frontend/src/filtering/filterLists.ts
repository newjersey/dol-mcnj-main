export const languageList = [
  {
    id: "ar",
    label: "Arabic"
  },
  {
    id: "zh",
    label: "Chinese"
  },
  {
    id: "fr",
    label: "French"
  },{
    id: "cre",
    label: "French Creole"
  },
  {
    id: "de",
    label: "German"
  },
  {
    id: "el",
    label: "Greek"
  },
  {
    id: "he",
    label: "Hebrew"
  },
  {
    id: "hi",
    label: "Hindi"
  },
  {
    id: "hu",
    label: "Hungarian"
  },
  {
    id: "it",
    label: "Italian"
  },
  {
    id: "ja",
    label: "Japanese"
  },
  {
    id: "ko",
    label: "Korean"
  },
  {
    id: "pl",
    label: "Polish"
  },
  {
    id: "pt",
    label: "Portuguese"
  },
  {
    id: "ru",
    label: "Russian"
  },
  {
    id: "es",
    label: "Spanish"
  },
  {
    id: "tl",
    label: "Tagalog"
  },
  {
    id: "vi",
    label: "Vietnamese"
  }
];

export type LanguageProps = "ar" | "zh" | "fr" | "cre" | "de" | "el" | "he" | "hi" | "hu" | "it" | "ja" | "ko" | "pl" | "pt" | "ru" | "es" | "tl" | "vi";

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
  }
]

export type ClassFormatProps = "online" | "inperson";