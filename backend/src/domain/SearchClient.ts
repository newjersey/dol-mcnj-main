export type TrainingId = string;

export interface SearchClient {
  search: (searchQuery: string) => Promise<TrainingId[]>;
  getHighlight: (id: string, searchQuery: string) => Promise<string>;
}
