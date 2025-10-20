/**
 * Converts all-uppercase text to title case, leaving mixed-case text unchanged.
 * 
 * Used to normalize ETPL data which inconsistently uses ALL CAPS. Only converts if the
 * entire string is uppercase; preserves existing mixed-case formatting (e.g., "McDowell").
 * 
 * @param text - Text to potentially convert (may be null from database)
 * @returns Title-cased text if input was all uppercase, otherwise returns original text
 * 
 * @example
 * ```typescript
 * convertToTitleCaseIfUppercase('BERGEN COUNTY')     // Returns: Bergen County
 * convertToTitleCaseIfUppercase('Bergen County')     // Returns: Bergen County
 * convertToTitleCaseIfUppercase('McDonald Training') // Returns: McDonald Training
 * convertToTitleCaseIfUppercase(null)                // Returns: ""
 * ```
 */
export const convertToTitleCaseIfUppercase = (text: string): string => {
  if (text === null) {
    return "";
  }

  if (text !== text.toUpperCase()) {
    return text;
  }

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
