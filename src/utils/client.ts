export const client = async ({
  query,
  variables,
  includeDrafts,
  excludeInvalid,
}: {
  query: string;
  variables?: Record<string, string | number | boolean | Array<any> | null>;
  includeDrafts?: boolean;
  excludeInvalid?: boolean;
}) => {
  // Function for making GraphQL requests to a server

  const headers: {
    authorization: string;
    "X-Include-Drafts"?: string;
    "X-Exclude-Invalid"?: string;
  } = {
    authorization: `Bearer ${process.env.REACT_APP_DELIVERY_API}`,
  };
  // Setting up the headers for the request with the authorization token

  if (includeDrafts) {
    headers["X-Include-Drafts"] = "true";
  }
  // If the includeDrafts flag is set, add the corresponding header to include drafts

  if (excludeInvalid) {
    headers["X-Exclude-Invalid"] = "true";
  }
  // If the excludeInvalid flag is set, add the corresponding header to exclude invalid items

  try {
    const response = await fetch(
      `https://${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_SPACE_ID}/environments/${process.env.REACT_APP_ENVIRONMENT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ query, variables }),
      },
    );
    // Making a POST request to the specified endpoint URL with the query, variables, and headers

    const responseData = await response.json();
    // Parsing the response data as JSON

    if (!response.ok) {
      throw new Error("GraphQL request failed");
    }

    return responseData.data;
    // Returning the response data
  } catch (error) {
    throw new Error("GraphQL request failed");
  }
};
