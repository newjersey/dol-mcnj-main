import { Tag } from "./Tag";
import { TagProps } from "../../types/contentful";

interface ResourceListHeadingProps {
  tags: TagProps[];
  count: number;
  totalCount: number;
  theme: "blue" | "purple" | "green" | "navy";
}

export const ResourceListHeading = ({
  tags,
  count,
  theme,
  totalCount,
}: ResourceListHeadingProps) => {
  const showing = count > 0 ? count : tags.length > 0 ? count : totalCount;
  return (
    <div className="list-heading">
      <div>
        <span className="label">filtered by:</span>
        <div className="tags">
          {tags.map((tag) => (
            <Tag
              key={tag.sys.id}
              title={tag.title}
              color={tag.category.slug === "audience" ? "blue" : theme}
            />
          ))}
        </div>
      </div>
      <span className="label">
        {showing} of {totalCount} items
      </span>
    </div>
  );
};
