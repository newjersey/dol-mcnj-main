import { Training } from "./Training";

export type SearchTrainings = (searchQuery: string) => Promise<Training[]>;
export type FindAllTrainings = () => Promise<Training[]>;
