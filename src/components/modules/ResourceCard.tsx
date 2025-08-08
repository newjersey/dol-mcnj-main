import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { Tag } from "./Tag";
import { ResourceCardProps } from "@utils/types";
import { Flex } from "@components/utility/Flex";
import { Box } from "@components/utility/Box";

export const ResourceCard = ({
  className,
  description,
  link,
  tags,
  theme = "green",
  title,
}: ResourceCardProps) => {
  const isRelative = link.startsWith("/");
  return (
    <Box
      radius={20}
      className={`resourceCard${theme ? ` theme-${theme}` : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      <Flex gap="xs" direction="column">
        <a
          className="title"
          href={link}
          target={isRelative ? "_self" : "_blank"}
          rel={isRelative ? "" : "noopener noreferrer"}
        >
          {title}
        </a>
        <div
          className="description"
          dangerouslySetInnerHTML={{
            __html: parseMarkdownToHTML(description),
          }}
        />
        <div>
          <span className="mt-4 mb-2 block text-[14px]">
            Filter categories:
          </span>
          <Flex gap="xs" flexWrap="wrap" className="tags" columnBreak="none">
            {tags.items.map((tag) => {
              const tagColor =
                tag.category.slug === "career-support"
                  ? "purple"
                  : tag.category.slug === "other"
                  ? "blue"
                  : tag.category.slug === "tuition-assistance"
                  ? "green"
                  : "navy";
              return (
                <Tag key={tag.sys.id} title={tag.title} color={tagColor} />
              );
            })}
          </Flex>
        </div>
      </Flex>
    </Box>
  );
};
