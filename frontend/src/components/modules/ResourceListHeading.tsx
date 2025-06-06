import { Tag } from "./Tag";
import { TagProps } from "../../types/contentful";
import { CaretDown } from "@phosphor-icons/react";

interface ResourceListHeadingProps {
  tags: TagProps[];
  count: number;
  totalCount: number;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  sortOrder?: "aToZ" | "zToA";
  setSortOrder?: (value: "aToZ" | "zToA") => void;
}

export const ResourceListHeading = ({
  tags,
  count,
  totalCount,
  setSearchQuery,
  searchQuery,
  sortOrder = "aToZ",
  setSortOrder,
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
        <div>
          <p className="label lrg">
            {count} of {totalCount} items
          </p>
          <span className="label">filtered by:</span>
        </div>
        {tags.length > 0 && (
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
        )}
      </div>

      <label htmlFor="sort-select" className="sort">
        Sort by:
        <span>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={(e) => {
              const value = e.target.value as "aToZ" | "zToA";
              setSortOrder?.(value);
            }}
          >
            <option value="default">Sort by</option>
            <option value="aToZ">A–Z</option>
            <option value="zToA">Z–A</option>
          </select>
          <CaretDown size={20} weight="bold" />
        </span>
      </label>
    </div>
  );
};
