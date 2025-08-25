const socPrefixes = ['00', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '31', '33', '35', '37', '39', '41', '43', '45', '47', '49', '51', '53'];
const cipPrefixes = ['01', '03', '04', '05', '09', '10', '11', '12', '13', '14', '15', '16', '19', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '60', '61'];

const hasSixDigits = (value: string) => {
  const parsedValue = value.replace(/[^0-9]/g, '');
  return parsedValue.length === 6;
};

const isCipCodePattern = (value: string): boolean => {
  // Check for 6-digit CIP code (e.g., "120501")
  if (/^[0-9]{6}$/.test(value)) {
    const firstTwoDigits = value.slice(0, 2);
    return cipPrefixes.includes(firstTwoDigits);
  }
  
  // Check for formatted CIP code (e.g., "12.0501")
  if (/^[0-9]{2}\.[0-9]{4}$/.test(value)) {
    const firstTwoDigits = value.slice(0, 2);
    return cipPrefixes.includes(firstTwoDigits);
  }
  
  return false;
};

export const checkValidCipCode = (value: string): string => {
  if (!isCipCodePattern(value)) return value;
  
  // If it's a formatted CIP code (e.g., "12.0501"), convert to unformatted (e.g., "120501")
  if (/^[0-9]{2}\.[0-9]{4}$/.test(value)) {
    return value.replace('.', '');
  }
  
  // Return as-is if already 6-digit format
  return value;
};

export const checkValidSocCode = (value: string) => {
  if (!hasSixDigits(value)) return value;

  const parsedValue = value.replace(/[^0-9]/g, '');
  const firstTwoDigits = parsedValue.slice(0, 2);

  if (socPrefixes.includes(firstTwoDigits)) {
    return `${parsedValue.slice(0, 2)}-${parsedValue.slice(2)}`;
  }

  return value;
};