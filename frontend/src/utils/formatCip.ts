export const formatCip = (cipCode: string): string => {
  // Remove any non-numeric characters except the dot
  cipCode = cipCode.replace(/[^0-9.]/g, '');

  // If already in xx.xxxx format, return as is
  if (/^\d{2}\.\d{4}$/.test(cipCode)) {
    return cipCode;
  }

  // Remove the dot for normalization
  cipCode = cipCode.replace('.', '');

  // Pad the code to ensure it's at least 6 digits
  cipCode = cipCode.padStart(6, "0");

  // Split into xx.xxxx format
  const firstPart = cipCode.slice(0, 2); // First two characters
  const secondPart = cipCode.slice(2, 6); // Next four characters

  return `${firstPart}.${secondPart}`;
};
