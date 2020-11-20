export const formatZip = (text: string): string => {
  const formattedText = text.length < 5 ? '0' + text : text;
  return formattedText;
};
