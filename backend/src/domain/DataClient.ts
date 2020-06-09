export interface DataClient {
  findAllPrograms: () => Promise<string[]>;
}
