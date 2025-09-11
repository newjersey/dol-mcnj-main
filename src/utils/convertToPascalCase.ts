export const convertToPascalCase = (string: string) => {
  return string
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Remove punctuation marks
    .trim()
    .split(/\s+/) // Split on spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};
