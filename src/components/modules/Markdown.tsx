import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

export const Markdown = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: parseMarkdownToHTML(content),
      }}
    />
  );
};
