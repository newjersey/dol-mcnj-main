"use client";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { SearchForm } from "@components/modules/SearchForm";
import { Flex } from "@components/utility/Flex";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { LinkProps } from "@utils/types";
import { useEffect, useState } from "react";

interface CrumbSearchProps {
  name: string;
  items: LinkProps[];
}

export const CrumbSearch = ({ name, items }: CrumbSearchProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeDropdown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", closeDropdown);

    const closeDropdownClick = (e: MouseEvent) => {
      const overlay = document.querySelector(".searchOverlay");

      if (overlay && overlay.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", closeDropdownClick);
  }, []);
  return (
    <div className="container">
      <Flex
        alignItems="center"
        columnBreak="none"
        justifyContent="space-between"
        className="crumbContainer"
      >
        {items && <Breadcrumbs pageTitle={name} crumbs={items} />}
        <button
          className="searchToggle mobile-only"
          onClick={() => setOpen(!open)}
        >
          <MagnifyingGlass size={32} weight="bold" />
        </button>
        <div className={`searchOverlay${open ? " open" : ""}`} />
        <button
          className={`closeSearch mobile-only${open ? " open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <div className="sr-only">Close search</div>
          <X size={24} weight="bold" />
        </button>
        <SearchForm
          className={open ? "open" : undefined}
          label="Search for training"
        />
      </Flex>
    </div>
  );
};
