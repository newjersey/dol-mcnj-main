export async function getHighlight (inputString: string, query: string): Promise<string> {
  const words = inputString.split(' ');
  const queryIndex = words.findIndex(word => word.includes(query));

  if (queryIndex === -1) {
    // query is not found in the input string
    return words.slice(0, 19).join(' ');
  }

  const startIndex = Math.max(queryIndex - 10, 0);
  const endIndex = Math.min(queryIndex + 11, words.length);

  return words.slice(startIndex, endIndex).join(' ');
}
