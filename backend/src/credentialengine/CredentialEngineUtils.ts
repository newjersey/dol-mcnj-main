export const credentialEngineUtils = {

  getCtidFromURL: async function (url: string) {
    const lastSlashIndex: number = url.lastIndexOf("/");
    const ctid: string = url.substring(lastSlashIndex + 1);
    return ctid;
  },

  getHighlight: async function (inputString: string, query: string) {
    const words = inputString.split(' ');
    const queryIndex = words.findIndex(word => word.includes(query));

    if (queryIndex === -1) {
      // query is not found in the input string
      return '';
    }

    const startIndex = Math.max(queryIndex - 10, 0);
    const endIndex = Math.min(queryIndex + 11, words.length);

    return words.slice(startIndex, endIndex).join(' ');
  }

}
