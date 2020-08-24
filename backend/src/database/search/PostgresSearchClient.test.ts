import { PostgresSearchClient } from "./PostgresSearchClient";

describe("PostgresSearchClient", () => {
  let dataClient: PostgresSearchClient;

  beforeAll(() => {
    const connection = {
      user: "postgres",
      host: "localhost",
      database: "d4adtest",
      password: "",
      port: 5432,
    };
    dataClient = new PostgresSearchClient(connection);
  });

  it("fetches description highlight for an id", async () => {
    const highlight = await dataClient.getHighlight("1", "tree");
    expect(highlight).toEqual(
      "interested in learning skills necessary for todays modern [[tree]] identification jobs. Students will learn to distinguish types of [[trees]]"
    );
  });

  it("uses occupation for highlight if no match in description", async () => {
    const highlight = await dataClient.getHighlight("3", "botanist");
    expect(highlight).toEqual("Career track: [[Botanists]], Chefs");
  });

  it("uses description for highlight if there's a match on occupation and description", async () => {
    const highlight = await dataClient.getHighlight("4", "chef");
    expect(highlight).toEqual(
      "mushrooms; they are good for you. Become a [[chef]] to help others eat mushrooms"
    );
  });

  it("returns empty highlight when a result does not have a match", async () => {
    const highlight = await dataClient.getHighlight("1", "class");
    expect(highlight).toEqual("");

    const highlightNoDescription = await dataClient.getHighlight("6", "class");
    expect(highlightNoDescription).toEqual("");
  });

  it("searches training ids when title, description matches a search query", async () => {
    const resultIds = await dataClient.search("tree");
    expect(resultIds.map((it) => it.id)).toEqual(expect.arrayContaining(["1", "2", "5"]));
  });

  it("returns search results in order of relevance", async () => {
    const resultIds = await dataClient.search("tree");
    expect(resultIds[0].id).toEqual("2");
    expect(resultIds[1].id).toEqual("1");
    expect(resultIds[2].id).toEqual("5");

    expect(resultIds[0].rank).toBeGreaterThan(resultIds[1].rank);
    expect(resultIds[1].rank).toBeGreaterThan(resultIds[2].rank);
  });

  afterAll(async () => {
    await dataClient.disconnect();
  });
});
