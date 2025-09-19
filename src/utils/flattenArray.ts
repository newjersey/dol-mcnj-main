export const flattenArray = (arr: any[]): any[] => {
  // Function for flattening a nested array

  return arr.reduce((result, current) => {
    if (Array.isArray(current)) {
      // If the current element is an array
      return [...result, ...flattenArray(current)];
      // Recursively flatten the nested array and concatenate the result
    }
    return [...result, current];
    // If the current element is not an array, add it to the result
  }, []);
};
