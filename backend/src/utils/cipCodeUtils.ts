const cipPrefixes = [
  "01",
  "03",
  "04",
  "05",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "19",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "60",
  "61",
];

/**
 * Detects if a search query is a CIP code pattern
 * @param query - The search query to check
 * @returns true if the query matches a valid CIP code pattern
 */
export const isCipCodeQuery = (query: string): boolean => {
  if (!query || typeof query !== "string") {
    return false;
  }

  const trimmedQuery = query.trim();

  // Check for 6-digit CIP code (e.g., "120501")
  if (/^[0-9]{6}$/.test(trimmedQuery)) {
    const firstTwoDigits = trimmedQuery.slice(0, 2);
    return cipPrefixes.includes(firstTwoDigits);
  }

  // Check for formatted CIP code (e.g., "12.0501")
  if (/^[0-9]{2}\.[0-9]{4}$/.test(trimmedQuery)) {
    const firstTwoDigits = trimmedQuery.slice(0, 2);
    return cipPrefixes.includes(firstTwoDigits);
  }

  return false;
};

/**
 * Normalizes a CIP code to the unformatted 6-digit format used in the database
 * @param cipCode - The CIP code to normalize (formatted or unformatted)
 * @returns The normalized 6-digit CIP code
 */
export const normalizeCipCode = (cipCode: string): string => {
  if (!cipCode || typeof cipCode !== "string") {
    return cipCode;
  }

  const trimmedCode = cipCode.trim();

  // If it's a formatted CIP code (e.g., "12.0501"), convert to unformatted (e.g., "120501")
  if (/^[0-9]{2}\.[0-9]{4}$/.test(trimmedCode)) {
    return trimmedCode.replace(".", "");
  }

  // Return as-is if already 6-digit format
  return trimmedCode;
};
