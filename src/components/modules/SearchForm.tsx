import { Flex } from "@components/utility/Flex";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface SearchFormProps {
  className?: string;
  label?: string;
}

/**
 * Training program search form component.
 * 
 * Provides a simple search input with submit button that redirects to the training search
 * results page. Used on the homepage and training explorer pages.
 * 
 * @param props.className - Additional CSS classes for styling
 * @param props.label - Optional label text to display above search input
 * 
 * @example
 * ```tsx
 * <SearchForm label="Find training programs" />
 * <SearchForm className="hero-search" />
 * ```
 */
export const SearchForm = ({ className, label }: SearchFormProps) => {
  return (
    <form
      className={`searchForm${className ? ` ${className}` : ""}`}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const searchQuery = (
          document.getElementById("searchForm") as HTMLInputElement
        ).value;

        window.location.href = `/training/search?q=${encodeURIComponent(searchQuery)}`;
      }}
    >
      <Flex direction="column" gap="xxs" fill>
        {label && <label htmlFor="searchForm">{label}</label>}
        <div>
          <input
            type="search"
            id="searchForm"
            placeholder="Search"
            aria-label="Search for a training program"
          />
          <button type="submit">
            <MagnifyingGlass size={18} />
            <span className="sr-only">Search</span>
          </button>
        </div>
      </Flex>
    </form>
  );
};
