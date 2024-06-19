import { Dispatch, SetStateAction } from "react";

export const getPageTitle = (
  setPageTitle: Dispatch<SetStateAction<string>>,
  searchQuery?: string | null,
): void => {
  if (!searchQuery || searchQuery === "null") {
    setPageTitle(`Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`);
  } else {
    const query = decodeURIComponent(searchQuery.replace(/\+/g, " ")).toLocaleLowerCase();
    setPageTitle(
      `${query} | Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
    );
  }
};

export const getSearchQuery = (searchString: string | undefined): string | undefined => {
  const regex = /\?q=([^&]*)/;
  const matches = searchString?.match(regex);
  return matches ? decodeURIComponent(matches[1]) : undefined;
};