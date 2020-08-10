export const formatPercentEmployed = (percentEmployed: number | null): string => {
  if (percentEmployed === null) {
    return "--";
  }

  return (Math.trunc(percentEmployed * 1000) / 10).toFixed(1) + "%";
};
