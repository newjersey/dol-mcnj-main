/**
 * Formats zip codes to ensure 5-digit format by prepending zero if needed.
 * 
 * Some zip codes in NJ start with 0 (e.g., 07001) but are stored as integers
 * which drops the leading zero. This function ensures all zip codes are 5 digits.
 * 
 * @param text - Zip code as string (may be 4 or 5 digits)
 * @returns Formatted 5-digit zip code string
 * 
 * @example
 * ```typescript
 * formatZip('7001')    // Returns: '07001' (Newark)
 * formatZip('08601')   // Returns: '08601' (Trenton)
 * formatZip('10001')   // Returns: '10001' (already 5 digits)
 * ```
 */
export const formatZip = (text: string): string => {
  const formattedText = text.length < 5 ? "0" + text : text;
  return formattedText;
};
