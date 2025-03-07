export const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  if (typeof window !== "undefined") {
    const q = new URL(window.location.href);
    const searchParams = q.searchParams;
    if (e.target.value === "") {
      searchParams.delete("sort");
      const newUrlWithSort = searchParams.toString();
      window.location.href = `/training/search?${newUrlWithSort}`;
    } else {
      const newUrlWithSort = new URLSearchParams(searchParams);
      newUrlWithSort.set("sort", e.target.value);
      window.location.href = `/training/search?${newUrlWithSort}`;
    }
  }
};
