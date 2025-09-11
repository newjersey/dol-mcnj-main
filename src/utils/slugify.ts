// Function to convert a string into a slug
function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, "");
  // Remove leading and trailing whitespace

  str = str.toLowerCase();
  // Convert the string to lowercase

  const from =
    "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  const to =
    "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    // Replace special characters with their corresponding characters
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "")
    // Remove any remaining special characters except alphanumeric, hyphen, and space

    .replace(/\s+/g, "-")
    // Replace whitespace with hyphens

    .replace(/-+/g, "-");
  // Replace consecutive hyphens with a single hyphen

  return str;
  // Return the slugified string
}

export { slugify };

export const camelify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

export const unCamelify = (text: string) => {
  const separatedWords = text.replace(/([A-Z])/g, " $1").toLowerCase();
  const capitalizeFirstLetterOfEachWord = separatedWords
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return capitalizeFirstLetterOfEachWord.join(" ");
};
