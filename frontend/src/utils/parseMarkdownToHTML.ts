import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt(/* Markdown-it options */);

export const parseMarkdownToHTML = (markdown: string): string => {
  return mdParser.render(markdown);
};

// New function that modifies link behavior to open in a new tab, fixed for TypeScript
export const parseMarkdownToHTMLWithLinksInNewTab = (markdown: string): string => {
  // Temporarily modify the renderer for link_open to handle target and rel attributes
  const originalLinkOpen = mdParser.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

  mdParser.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    // Adding target="_blank" and rel="noopener noreferrer" to links
    const aIndex = tokens[idx].attrIndex('target');
    if (aIndex < 0) {
      tokens[idx].attrPush(['target', '_blank']); // add new attribute
    } else {
      tokens[idx].attrs![aIndex][1] = '_blank'; // replace existing attribute
    }

    const relIndex = tokens[idx].attrIndex('rel');
    if (relIndex < 0) {
      tokens[idx].attrPush(['rel', 'noopener noreferrer']); // add new attribute
    } else {
      tokens[idx].attrs![relIndex][1] = 'noopener noreferrer'; // replace existing attribute
    }

    return originalLinkOpen(tokens, idx, options, env, self);
  };

  // Render the markdown with modified link behavior
  const html = mdParser.render(markdown);

  // Reset to original link_open renderer to avoid side effects
  mdParser.renderer.rules.link_open = originalLinkOpen;

  return html;
};
