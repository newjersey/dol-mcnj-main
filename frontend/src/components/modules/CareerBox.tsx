import { parseMarkdownToHTML } from "../../utils/parseMarkdownToHTML";
import { IconSelector } from "../IconSelector";

export const CareerBox = ({
  icon,
  content,
  title,
}: {
  icon: string;
  content: string;
  title: string;
}) => {
  return (
    <div className="box">
      <div className="heading-bar">
        <IconSelector name={icon} size={32} />
        {title}
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html: parseMarkdownToHTML(content),
        }}
      />
    </div>
  );
};
