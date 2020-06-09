import { Program } from "./Program";

export interface DataClient {
  findAllPrograms: () => Promise<Program[]>;
}
