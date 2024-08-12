export const formatCip = (cipCode: string): string => {
  // Ensure the string is of adequate length or pad if necessary
  cipCode = cipCode.padStart(6, '0'); // Ensures there are at least six characters, padding with '0' if not.
  const firstPart = cipCode.slice(0, 2); // Take the first two characters
  const secondPart = cipCode.slice(2, 6); // Take the next four characters
  return `${firstPart}.${secondPart}`;
};
