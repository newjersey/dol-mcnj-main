export const noOrphans = (string: string) => {
  // Function for preventing orphans in a string
  return string?.replace(/\s([^\s<]+)\s*$/, "\u00A0$1");
  // Using the replace method to match the last occurrence of a space followed by non-space and non-HTML tag characters
  // The trailing spaces are also matched
  // The matched string is replaced with a non-breaking space (\u00A0) followed by the matched word or characters
};
