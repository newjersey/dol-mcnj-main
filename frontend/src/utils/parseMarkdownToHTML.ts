import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt(/* Markdown-it options */);

export const parseMarkdownToHTML = (markdown: string): string => {
  return mdParser.render(markdown);
};
