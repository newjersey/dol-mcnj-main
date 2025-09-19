export const numberWithCommas = (number?: number) => {
  // Function for formatting a number with commas

  if (!number && typeof number !== "number" && number !== 0) {
    // If the number is not provided or is falsy
    return "N/A";
    // Return "N/A" indicating the number is not available
  }

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Convert the number to a string, and use regex to insert commas every three digits
};
