export const checkValidZipCode = (value: string) => {
  // string HAS to start with 0
  if (value[0] !== "0") return false;
  const parsedValue = parseInt(value);
  if (typeof parsedValue !== "number") return false;
  return parsedValue >= 7001 && parsedValue <= 8999;
};
