import { Program } from "./Program";

export type SearchPrograms = (searchQuery: string) => Promise<Program[]>;
export type FindAllPrograms = () => Promise<Program[]>;
