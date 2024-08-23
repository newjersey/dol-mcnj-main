import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { Tag } from "./Tag";
import { ResourceCardProps } from "@utils/types";
import { Flex } from "@components/utility/Flex";
import { Box } from "@components/utility/Box";

export const ResourceCard = ({
  className,
  description,
  link,
  tagsCollection,
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
      <Flex gap="sm" direction="column">
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
        <Flex gap="xs" flexWrap="wrap" className="tags" columnBreak="none">
          {tagsCollection.items.map((tag) => (
            <Tag key={tag.sys.id} title={tag.title} color={theme} />
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};
