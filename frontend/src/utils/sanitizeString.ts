export const sanitizeString = (str: string): string => {
  // Replace potentially harmful characters with safe equivalents
  const safeString = str.replace(/[<>&"'\/]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      case "/":
        return "&#x2F;";
      default:
        return char;
    }
  });

  return safeString;
};
