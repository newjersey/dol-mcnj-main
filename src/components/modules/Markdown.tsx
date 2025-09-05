import { marked } from "marked";

export const Markdown = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  const htmlContent = marked.parse(content, { async: false });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: htmlContent,
      }}
    />
  );
};
