export const toUsCurrency = (number: number): string => {
  const formattedNumber = number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedNumber.endsWith(".00")
    ? formattedNumber.slice(0, -3)
    : formattedNumber;
};
