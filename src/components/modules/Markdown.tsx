import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt(/* Markdown-it options */);

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
        __html: mdParser.render(content),
      }}
    />
  );
};
