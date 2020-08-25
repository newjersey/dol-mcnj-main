export const convertToTitleCaseIfUppercase = (text: string): string => {
  if (text !== text.toUpperCase()) {
    return text;
  }

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
