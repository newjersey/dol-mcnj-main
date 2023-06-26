import { TagProps } from "../types/contentful";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";
import { Tag } from "./modules/Tag";

interface ResourceCardProps {
  className?: string;
  description: string;
  link: string;
  tags: {
    items: TagProps[];
  };
  theme?: "blue" | "purple" | "green" | "navy";
  title: string;
}

export const ResourceCard = ({
  className,
  description,
  link,
  tags,
  theme = "green",
  title,
}: ResourceCardProps) => {
  const isRelative = link.startsWith("/");
  const target = isRelative ? "_self" : "_blank";
  const rel = isRelative ? "" : "noopener noreferrer";

  // sort tags by their category
  tags.items.sort((a, b) => {
    if (a.category.slug === "audience") {
      return 1;
    }
    if (b.category.slug === "audience") {
      return -1;
    }
    return 0;
  });

  return (
    <div
      className={`resourceCard${theme ? ` theme-${theme}` : ""}${className ? ` ${className}` : ""}`}
    >
      <a href={link} target={target} rel={rel}>
        {title}
      </a>
      <div
        className="description"
        dangerouslySetInnerHTML={{
          __html: parseMarkdownToHTML(description),
        }}
      />

      <div className="tags">
        {tags.items.map((tag) => (
          <Tag
            key={tag.sys.id}
            title={tag.title}
            color={tag.category.slug === "audience" ? "blue" : theme}
          />
        ))}
      </div>
    </div>
  );
};
