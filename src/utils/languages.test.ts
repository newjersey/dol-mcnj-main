import { allLanguages, dataValueToLanguage } from "./languages";

describe("dataValueToLanguage", () => {
  it("should map data values to the correct languages", () => {
    // Iterate through each key-value pair in the dataValueToLanguage object
    for (const [dataValue, language] of Object.entries(dataValueToLanguage)) {
      // Check if the mapped language is in the allLanguages array
      expect(allLanguages).toContain(language);
    }
  });

  it("should have all unique language mappings", () => {
    const values = Object.values(dataValueToLanguage);
    const uniqueValues = new Set(values);
    // Check if all values are unique
    expect(values.length).toBe(uniqueValues.size);
  });

  it("should cover all expected data values", () => {
    const expectedDataValues = [
      "Arabic",
      "Chinese",
      "French",
      "French/French Creole",
      "German",
      "Greek",
      "Yiddish/Hebrew",
      "Indic/Hindu",
      "Hungarian",
      "Italian",
      "Japanese",
      "Korean",
      "Polish",
      "Portuguese",
      "Russian",
      "Spanish",
      "Tagalog (Philipines)",
      "Vietnamese",
    ];

    // Check if all expected data values are covered in the dataValueToLanguage object
    expect(Object.keys(dataValueToLanguage)).toEqual(
      expect.arrayContaining(expectedDataValues),
    );
  });

  it("should map expected data values correctly", () => {
    const mappings = {
      Arabic: "Arabic",
      Chinese: "Chinese",
      French: "French",
      "French/French Creole": "French Creole",
      German: "German",
      Greek: "Greek",
      "Yiddish/Hebrew": "Hebrew",
      "Indic/Hindu": "Hindi",
      Hungarian: "Hungarian",
      Italian: "Italian",
      Japanese: "Japanese",
      Korean: "Korean",
      Polish: "Polish",
      Portuguese: "Portuguese",
      Russian: "Russian",
      Spanish: "Spanish",
      "Tagalog (Philipines)": "Tagalog",
      Vietnamese: "Vietnamese",
    };

    // Check if each expected data value maps to the correct language
    for (const [dataValue, language] of Object.entries(mappings)) {
      expect(dataValueToLanguage[dataValue]).toBe(language);
    }
  });
});
