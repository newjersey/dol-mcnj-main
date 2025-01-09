export const handleItemsPerPageChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  if (typeof window !== "undefined") {
    const q = new URL(window.location.href);
    const searchParams = q.searchParams;
    if (e.target.value === "") {
      searchParams.delete("limit");
      searchParams.set("p", "1");
      const newUrlWithItemsPerPage = searchParams.toString();
      window.location.href = `/training/search?${newUrlWithItemsPerPage}`;
    } else {
      const newUrlWithItemsPerPage = new URLSearchParams(searchParams);
      newUrlWithItemsPerPage.set("p", "1");
      newUrlWithItemsPerPage.set("limit", e.target.value);
      window.location.href = `/training/search?${newUrlWithItemsPerPage}`;
    }
  }
};
