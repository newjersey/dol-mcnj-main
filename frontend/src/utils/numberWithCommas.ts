export const numberWithCommas = (number?: number) => {
  if (!number) {
    return "N/A";
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
