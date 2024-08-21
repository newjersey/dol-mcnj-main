export const sanitizeString = (str: string): string => {
  // Function for sanitizing a string by replacing special characters with their corresponding HTML entities

  const safeString = str.replace(/[<>&"'\/]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      // Replace less than symbol with HTML entity
      case ">":
        return "&gt;";
      // Replace greater than symbol with HTML entity
      case "&":
        return "&amp;";
      // Replace ampersand with HTML entity
      case '"':
        return "&quot;";
      // Replace double quote with HTML entity
      case "'":
        return "&#39;";
      // Replace single quote with HTML entity
      case "/":
        return "&#x2F;";
      // Replace forward slash with HTML entity
      default:
        return char;
      // Return the character as is if it doesn't match any special character
    }
  });

  return safeString;
  // Return the sanitized string
};
