import { getNav } from "./getNav";
import { client } from "./client";
import { NAV_MENU_QUERY } from "../queries/navMenu";

// Mock the client function
jest.mock("./client");

describe("getNav", () => {
  it("fetches and returns navigation data correctly", async () => {
    // Mock data
    const mockGlobalNav = { menu: { id: "globalNav", items: [] } };
    const mockMainNav = { menu: { id: "mainNav", items: [] } };
    const mockFooterNav1 = { menu: { id: "footerNav1", items: [] } };
    const mockFooterNav2 = { menu: { id: "footerNav2", items: [] } };

    // Mock the client implementation to return mock data
    (client as jest.Mock).mockImplementation(({ variables }) => {
      switch (variables.id) {
        case "7ARTjtRYG7ctcjPd1nbCHr":
          return Promise.resolve(mockGlobalNav);
        case "6z5HiOP5HqvJc07FURpT8Z":
        case "3jcP5Uz9OY7syy4zu9Viul":
          return Promise.resolve(mockMainNav);
        case "6QDRPQOaswzG5gHPgqoOkS":
          return Promise.resolve(mockFooterNav1);
        case "3WHbfXiLFSBXRC24QCq8H6":
          return Promise.resolve(mockFooterNav2);
        default:
          return Promise.resolve(null);
      }
    });

    // Set the environment variable for testing
    process.env.REACT_APP_FEATURE_CAREER_PATHWAYS = "true";

    const result = await getNav();

    expect(client).toHaveBeenCalledTimes(4);
    expect(client).toHaveBeenCalledWith({
      query: NAV_MENU_QUERY,
      variables: { id: "7ARTjtRYG7ctcjPd1nbCHr" },
    });
    expect(client).toHaveBeenCalledWith({
      query: NAV_MENU_QUERY,
      variables: { id: "6z5HiOP5HqvJc07FURpT8Z" },
    });
    expect(client).toHaveBeenCalledWith({
      query: NAV_MENU_QUERY,
      variables: { id: "6QDRPQOaswzG5gHPgqoOkS" },
    });
    expect(client).toHaveBeenCalledWith({
      query: NAV_MENU_QUERY,
      variables: { id: "3WHbfXiLFSBXRC24QCq8H6" },
    });

    expect(result).toEqual({
      globalNav: mockGlobalNav.menu,
      mainNav: mockMainNav.menu,
      footerNav1: mockFooterNav1.menu,
      footerNav2: mockFooterNav2.menu,
    });
  });

  it("fetches the correct mainNav id based on REACT_APP_FEATURE_CAREER_PATHWAYS", async () => {
    // Mock data
    const mockGlobalNav = { menu: { id: "globalNav", items: [] } };
    const mockMainNav = { menu: { id: "mainNav", items: [] } };
    const mockFooterNav1 = { menu: { id: "footerNav1", items: [] } };
    const mockFooterNav2 = { menu: { id: "footerNav2", items: [] } };

    // Mock the client implementation to return mock data
    (client as jest.Mock).mockImplementation(({ variables }) => {
      switch (variables.id) {
        case "7ARTjtRYG7ctcjPd1nbCHr":
          return Promise.resolve(mockGlobalNav);
        case "6z5HiOP5HqvJc07FURpT8Z":
        case "3jcP5Uz9OY7syy4zu9Viul":
          return Promise.resolve(mockMainNav);
        case "6QDRPQOaswzG5gHPgqoOkS":
          return Promise.resolve(mockFooterNav1);
        case "3WHbfXiLFSBXRC24QCq8H6":
          return Promise.resolve(mockFooterNav2);
        default:
          return Promise.resolve(null);
      }
    });

    // Set the environment variable for testing
    process.env.REACT_APP_FEATURE_CAREER_PATHWAYS = "false";

    const result = await getNav();

    expect(client).toHaveBeenCalledTimes(8);
    expect(client).toHaveBeenCalledWith({
      query: NAV_MENU_QUERY,
      variables: { id: "7ARTjtRYG7ctcjPd1nbCHr" },
    });
    expect(client).toHaveBeenCalledWith({
      query: NAV_MENU_QUERY,
      variables: { id: "3jcP5Uz9OY7syy4zu9Viul" },
    });
    expect(client).toHaveBeenCalledWith({
      query: NAV_MENU_QUERY,
      variables: { id: "6QDRPQOaswzG5gHPgqoOkS" },
    });
    expect(client).toHaveBeenCalledWith({
      query: NAV_MENU_QUERY,
      variables: { id: "3WHbfXiLFSBXRC24QCq8H6" },
    });

    expect(result).toEqual({
      globalNav: mockGlobalNav.menu,
      mainNav: mockMainNav.menu,
      footerNav1: mockFooterNav1.menu,
      footerNav2: mockFooterNav2.menu,
    });
  });

  it("returns null for any client errors", async () => {
    // Mock the client implementation to throw an error
    (client as jest.Mock).mockRejectedValue(
      new Error("GraphQL request failed"),
    );

    await expect(getNav()).rejects.toThrow("GraphQL request failed");
  });
});
