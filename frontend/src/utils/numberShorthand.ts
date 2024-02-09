export const numberShorthand = (num: number): string => {
  const suffixes = ["", "k", "M", "B", "T"];
  const suffixIndex = Math.floor(Math.log10(num) / 3);
  const shortNum = num / Math.pow(1000, suffixIndex);
  const roundedNum = Math.round(shortNum * 10) / 10;
  return roundedNum.toString() + suffixes[suffixIndex];
};
