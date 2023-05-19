// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const flattenArray = (arr: any[]): any[] => {
  return arr.reduce((result, current) => {
    if (Array.isArray(current)) {
      return [...result, ...flattenArray(current)];
    }
    return [...result, current];
  }, []);
};
