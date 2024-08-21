export const formatPercentEmployed = (percentEmployed: number): string => {
  return (Math.trunc(percentEmployed * 1000) / 10).toFixed(1) + "%";
};
