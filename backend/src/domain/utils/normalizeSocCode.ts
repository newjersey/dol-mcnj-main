// Utility to normalize SOC codes
export const normalizeSocCode = (socCode: string): string => {
  // Remove non-numeric characters except the dash
  socCode = socCode.replace(/[^0-9-]/g, '');

  // If already in xx-xxxx format, return as is
  if (/^\d{2}-\d{4}$/.test(socCode)) {
    return socCode;
  }

  // Remove the dash for normalization
  socCode = socCode.replace('-', '');

  // Pad the code to ensure it's at least 6 digits
  socCode = socCode.padStart(6, '0');

  // Split into xx-xxxx format
  const firstPart = socCode.slice(0, 2);
  const secondPart = socCode.slice(2, 6);

  return `${firstPart}-${secondPart}`;
};
