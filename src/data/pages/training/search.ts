import { AlertProps } from "@components/modules/Alert";

export const SEARCH_RESULTS_PAGE_DATA = {
  breadcrumbs: {
    style: { marginBottom: "1rem" },
    pageTitle: "Search",
    crumbs: [
      {
        copy: "Home",
        url: "/",
      },
      {
        copy: "Training Explorer",
        url: "/training",
      },
    ],
  },
  sortOptions: [
    {
      key: "Best Match",
      value: "",
    },
    {
      key: "Cost: Low to High",
      value: "low",
    },
    {
      key: "Cost: High to Low",
      value: "high",
    },
    {
      key: "Employment Rate",
      value: "rate",
    },
  ],
  perPageOptions: [
    {
      key: "10",
      value: "",
    },
    {
      key: "20",
      value: "20",
    },
    {
      key: "50",
      value: "50",
    },
    {
      key: "100",
      value: "100",
    },
  ],
  searchHelp: {
    collapsable: true,
    type: "info",
    copy: `*   Check your spelling to ensure it is correct.
*   Verify and adjust any filters that you might have applied to your search.
*   Are your search results too small? Your search may be too specific. Try searching with fewer words.

### Here are some examples that may improve your search results:

*   **Training Providers**: If you're searching for a training provider, try using only the provider's name and exclude words like "university" or "college".
*   **Occupations**: If you're looking for training for a job, you can type the job directly into the search box.
*   **License**: If you know the name of the license you're training for, use the acronym to see more results. For example, for the commercial driving license, try searching for "CDL".`,
    heading: "Not seeing the results you were looking for?",
  } as AlertProps,
};
