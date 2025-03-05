import { Tag } from "@components/modules/Tag";
import { TagProps, ThemeColors } from "@utils/types";

interface HeadingBlockProps {
  tags: TagProps[];
  count: number;
  totalCount: number;
  theme: ThemeColors;
}

export const HeadingBlock = ({
  tags,
  count,
  theme,
  totalCount,
}: HeadingBlockProps) => {
  const showing = count > 0 ? count : tags.length > 0 ? count : totalCount;

  const inputClick = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;
    input.focus();
    input.click();
  };

  return (
    <div className="listHeading">
      <div>
        <span className="label">filtered by:</span>
        <div className="tags">
          {tags.map((tag) => (
            <button
              key={tag.sys.id}
              className="tag-button"
              onClick={() => {
                inputClick(tag.sys.id);
              }}
            >
              <Tag
                title={tag.title}
                color={tag.category.slug === "audience" ? "blue" : theme}
                suffixIcon="X"
                iconWeight="bold"
              />
            </button>
          ))}
        </div>
      </div>
      <span className="label lrg">
        {showing} of {totalCount} items
      </span>
    </div>
  );
};
