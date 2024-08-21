export function replaceDoubleBracketsWithStrong(text: string): string {
  const regex = /\[\[([\w\s]+?)\]\]/g;
  // The regex pattern /\[\[([\w\s]+?)\]\]/ captures words and spaces between [[ and ]]
  // using the non-greedy modifier ?.

  const replacedText = text.replace(regex, "<strong>$1</strong>");
  // $1 represents the captured word(s) from the regex pattern.

  return replacedText;
}
