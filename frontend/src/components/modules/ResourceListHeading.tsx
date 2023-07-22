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

  const inputClick = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;
    input.focus();
    input.click();
  };

  return (
    <div className="list-heading">
      <div>
        <span className="label">filtered by:</span>
        <div className="tags">
          {tags.map((tag) => (
            <button
              key={tag.sys.id}
              onClick={() => {
                inputClick(tag.sys.id);
              }}
            >
              <Tag
                title={tag.title}
                color={tag.category.slug === "audience" ? "blue" : theme}
                icon="X"
                iconSize={20}
                iconWeight="bold"
                suffix
              />
            </button>
          ))}
        </div>
      </div>
      <span className="label">
        {showing} of {totalCount} items
      </span>
    </div>
  );
};
