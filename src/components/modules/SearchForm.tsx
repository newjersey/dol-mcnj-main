import { Flex } from "@components/utility/Flex";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface SearchFormProps {
  className?: string;
  label?: string;
}

export const SearchForm = ({ className, label }: SearchFormProps) => {
  return (
    <form
      className={`searchForm${className ? ` ${className}` : ""}`}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const searchQuery = (
          document.getElementById("searchForm") as HTMLInputElement
        ).value;

        window.location.href = `/training/search?q=${searchQuery}`;
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
