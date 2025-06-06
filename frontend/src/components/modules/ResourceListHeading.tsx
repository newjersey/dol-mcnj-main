import { Tag } from "./Tag";
import { TagProps } from "../../types/contentful";

interface ResourceListHeadingProps {
  tags: TagProps[];
  count: number;
  totalCount: number;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const ResourceListHeading = ({
  tags,
  count,
  totalCount,
  setSearchQuery,
  searchQuery,
}: ResourceListHeadingProps) => {
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
          {searchQuery && (
            <button
              onClick={() => {
                if (setSearchQuery) {
                  setSearchQuery("");
                }
              }}
            >
              <Tag
                title={`"${searchQuery}"`}
                color="gray"
                icon="X"
                iconSize={20}
                iconWeight="bold"
                suffix
              />
            </button>
          )}

          {tags.map((tag) => (
            <button
              key={tag.sys.id}
              onClick={() => {
                inputClick(tag.sys.id);
              }}
            >
              <Tag
                title={tag.title}
                color={
                  tag.category.slug === "audience"
                    ? "blue"
                    : tag.category.title === "Career Support"
                      ? "purple"
                      : tag.category.title === "Tuition Assistance"
                        ? "green"
                        : "navy"
                }
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
        {count} of {totalCount} items
      </span>
    </div>
  );
};
