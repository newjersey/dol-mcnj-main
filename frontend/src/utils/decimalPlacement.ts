export const decimalPlacement = (value: number | string): number => {
  if (typeof value === "string") {
    value = parseInt(value);
  }

  value = value / 10000;

  return parseFloat(value.toFixed(4));
};
