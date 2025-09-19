export const numberShorthand = (num: number): string => {
  // Function for converting a number into a shorthand format

  if (num === 0) {
    // If the number is not provided or is falsy
    return "0";
  }

  const suffixes = ["", "k", "M", "B", "T"];
  // Array of suffixes representing different magnitudes (e.g., thousand, million, billion, etc.)

  const suffixIndex = Math.floor(Math.log10(num) / 3);
  // Determine the index of the suffix based on the magnitude of the number

  const shortNum = num / Math.pow(1000, suffixIndex);
  // Convert the number to a scaled-down version by dividing it by the corresponding power of 1000

  const roundedNum = Math.round(shortNum * 10) / 10;
  // Round the scaled-down number to one decimal place

  return roundedNum.toString() + suffixes[suffixIndex];
  // Combine the rounded number with the corresponding suffix to form the shorthand representation
};
