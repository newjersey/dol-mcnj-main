export const stripUnicode = (text: string): string => {
  return text ? text.replace(/[\u00BF]/g, "") : text;
};
