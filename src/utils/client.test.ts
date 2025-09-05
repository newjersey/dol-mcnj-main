import { client } from "./client";

describe("client function", () => {
  const originalFetch = global.fetch;
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const query = `
    query TestQuery {
      testField
    }
  `;
  const variables = { testVariable: "testValue" };
  const apiUrl = `https://${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_SPACE_ID}/environments/${process.env.REACT_APP_ENVIRONMENT}`;
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${process.env.REACT_APP_DELIVERY_API}`,
  };

  afterEach(() => {
    mockFetch.mockReset();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("makes a request with the correct headers and body", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ data: { testField: "testValue" } }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    const response = await client({ query, variables });

    expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });
    expect(response).toEqual({ testField: "testValue" });
  });

  it("includes drafts when includeDrafts is true", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ data: { testField: "testValue" } }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    const response = await client({ query, variables, includeDrafts: true });

    expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
      method: "POST",
      headers: {
        ...headers,
        "X-Include-Drafts": "true",
      },
      body: JSON.stringify({ query, variables }),
    });
    expect(response).toEqual({ testField: "testValue" });
  });

  it("excludes invalid items when excludeInvalid is true", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ data: { testField: "testValue" } }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    const response = await client({ query, variables, excludeInvalid: true });

    expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
      method: "POST",
      headers: {
        ...headers,
        "X-Exclude-Invalid": "true",
      },
      body: JSON.stringify({ query, variables }),
    });
    expect(response).toEqual({ testField: "testValue" });
  });

  it("handles a failed request", async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ errors: [{ message: "Error" }] }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await expect(client({ query, variables })).rejects.toThrow(
      "GraphQL request failed",
    );
  });

  it("handles a network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network Error"));

    await expect(client({ query, variables })).rejects.toThrow(
      "GraphQL request failed",
    );
  });
});
