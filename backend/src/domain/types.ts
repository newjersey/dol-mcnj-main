import { Program } from "./Program";

export type searchPrograms = (searchQuery: string) => Promise<Program[]>;
export type findAllPrograms = () => Promise<Program[]>;
