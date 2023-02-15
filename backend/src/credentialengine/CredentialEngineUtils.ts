export const credentialEngineUtils = {

  getCtidFromURL: async function (url: string) {
    const lastSlashIndex: number = url.lastIndexOf("/");
    const ctid: string = url.substring(lastSlashIndex + 1);
    return ctid;
  },
}
