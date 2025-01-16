import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { slugify } from "./slugify";

// Initialize MarkdownIt
const mdParser = new MarkdownIt({
  html: true, // Allow HTML tags in the Markdown content
  linkify: true, // Automatically link URLs
});

// Use the markdown-it-anchor plugin
mdParser.use(markdownItAnchor, {
  slugify: (s: string) => slugify(s),
  level: 1,
  permalink: false,
});

// Custom renderer rule for links to open external links in new tabs
const defaultRender =
  mdParser.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

mdParser.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];

  // Extract the href attribute
  const hrefIndex = token.attrIndex("href");
  if (hrefIndex >= 0) {
    const href = token.attrs?.[hrefIndex]?.[1] || "";

    // Check if the link is external
    if (href.startsWith("http://") || href.startsWith("https://")) {
      // Add target="_blank" and rel="noopener noreferrer"
      token.attrPush(["target", "_blank"]);
      token.attrPush(["rel", "noopener noreferrer"]);
    }
  }

  return defaultRender(tokens, idx, options, env, self);
};

// Exported function
export const parseMarkdownToHTML = (markdown: string): string => {
  return mdParser.render(markdown);
};
