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
};
