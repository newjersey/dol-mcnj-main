import React from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const processMarkdown = (markdown: string) => {
    return unified().use(remarkParse).use(remarkHtml).processSync(markdown).toString();
  };

  const html = processMarkdown(markdown);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownRenderer;
