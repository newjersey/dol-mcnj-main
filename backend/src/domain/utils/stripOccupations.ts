export const stripOccupations = (text: string): string => {
  return text ? text.replace(/ Occupations$/, "") : text;
};
