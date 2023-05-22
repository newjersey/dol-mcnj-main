export const parseMarkdownToHTML = (markdown: string): string => {
  const rules: Rule[] = [
    // Headers
    { regex: /^#{1,6} (.+)$/gm, replacement: "<h$1>$2</h$1>" },
    // Bold
    { regex: /\*\*(.*?)\*\*/gm, replacement: "<strong>$1</strong>" },
    // Italic
    { regex: /\*(.*?)\*/gm, replacement: "<em>$1</em>" },
    // Links
    { regex: /\[(.*?)\]\((.*?)\)/gm, replacement: '<a href="$2">$1</a>' },
    // Code blocks
    { regex: /```([\s\S]*?)```/gm, replacement: "<pre><code>$1</code></pre>" },
    // Lists
    {
      regex: /^(\s*[-*]\s+.+\n)+/gm,
      replacement: (match) => {
        const listItems = match
          .trim()
          .split("\n")
          .map((item: string) => item.trim().replace(/^\s*[-*]\s+/, ""));
        const listItemHTML = listItems.map((item: string) => `<li>${item}</li>`).join("");
        return `<ul>${listItemHTML}</ul>`;
      },
    },
    // Line breaks
    { regex: /(\n{2,})/gm, replacement: "<br><br>" },
  ];

  let html = markdown;
  rules.forEach((rule) => {
    if (typeof rule.replacement === "string") {
      html = html.replace(rule.regex, rule.replacement);
    } else if (typeof rule.replacement === "function") {
      html = html.replace(rule.regex, rule.replacement);
    }
  });

  return html;
};

interface Rule {
  regex: RegExp;
  replacement: string | ((...args: any[]) => string);
}
