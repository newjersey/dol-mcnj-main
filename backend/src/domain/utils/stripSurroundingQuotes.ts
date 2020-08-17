export const stripSurroundingQuotes = (text: string): string => {
  return text.replace(/^"+|"+$/g, "");
};
