export interface SearchResult {
  id: string;
  rank: number;
}

export interface SearchClient {
  search: (searchQuery: string) => Promise<SearchResult[]>;
}
