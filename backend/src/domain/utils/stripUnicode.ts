/**
 * Removes problematic Unicode characters from text (specifically Spanish characters).
 * 
 * ETPL data sometimes contains Unicode characters that don't render correctly in HTML.
 * This function specifically removes inverted question marks (¿) and replaces √© with "e".
 * 
 * @param text - Text that may contain problematic Unicode characters
 * @returns Text with Unicode characters removed or replaced
 * 
 * @example
 * ```typescript
 * stripUnicode('¿Hola?')           // Returns: 'Hola?'
 * stripUnicode('caf√©')            // Returns: 'cafe'
 * stripUnicode('regular text')     // Returns: 'regular text'
 * ```
 */
export const stripUnicode = (text: string): string => {
  if (text) {
    return text.replace(/[\u00BF]/g, "").replace(/[\u221A][\u00A9]/g, "e");
  } else {
    return text;
  }
};
