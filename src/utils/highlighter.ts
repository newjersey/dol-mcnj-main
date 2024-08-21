import { noOrphans } from "./noOrphans";
import { sanitizeString } from "./sanitizeString";

export const highlighter = (string: string): any => {
  // Function for highlighting certain words in a string

  const wordArray: string[] = string.split(" ");
  // Splitting the string into an array of words

  const wordReturn: (string | JSX.Element)[] = wordArray.map((word: string) => {
    const inBrackets: boolean = word.indexOf("[") >= 0;
    // Checking if the word is enclosed in brackets

    if (!inBrackets) return sanitizeString(word);
    // If the word is not enclosed in brackets, sanitize it and return it as is

    const matchedString: string = word.match(/\[\[([^\]]+)\]\]/)![1];
    // Extracting the word within the double square brackets

    return `<span class="highlight">${sanitizeString(matchedString)}</span>`;
    // Wrapping the matched word in a span with a "highlight" class and sanitizing it
  });

  return noOrphans(wordReturn.join(" "));
  // Joining the words back into a string and passing it through the "noOrphans" function to prevent widows/orphans
};
