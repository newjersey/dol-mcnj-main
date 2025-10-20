/**
 * Removes surrounding quotation marks from text (leading and trailing only).
 * 
 * Used extensively for cleaning ETPL CSV data which often wraps values in quotes.
 * Only removes quotes at the start and end of the string, preserving internal quotes.
 * 
 * @param text - String that may have surrounding quotes
 * @returns String without leading/trailing quotes
 * 
 * @example
 * ```typescript
 * stripSurroundingQuotes('"Web Development"') // Returns: Web Development
 * stripSurroundingQuotes('He said "hello"')   // Returns: He said "hello"
 * ```
 */
export const stripSurroundingQuotes = (text: string): string => {
  return text.replace(/^"+|"+$/g, "");
};
