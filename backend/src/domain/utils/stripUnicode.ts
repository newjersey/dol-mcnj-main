export const stripUnicode = (text: string): string => {
  if (text) {
    return text.replace(/[\u00BF]/g, "").replace(/[\u221A][\u00A9]/g, "e");
  } else {
    return text;
  }
};
