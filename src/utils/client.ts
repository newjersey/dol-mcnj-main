import { errorService } from '../services/ErrorService';

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

  const endpoint = `https://${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_SPACE_ID}/environments/${process.env.REACT_APP_ENVIRONMENT}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ query, variables }),
    });
    // Making a POST request to the specified endpoint URL with the query, variables, and headers

    const responseData = await response.json();
    // Parsing the response data as JSON

    if (!response.ok) {
      // Create a proper error with response details
      const error = new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
      (error as any).response = {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      };
      throw error;
    }

    // Check for GraphQL errors in the response
    if (responseData.errors && responseData.errors.length > 0) {
      const error = new Error(`GraphQL errors: ${responseData.errors.map((e: any) => e.message).join(', ')}`);
      (error as any).graphqlErrors = responseData.errors;
      throw error;
    }

    return responseData.data;
    // Returning the response data
  } catch (error) {
    // Use ErrorService to handle the error
    const userMessage = errorService.handleApiError(error, endpoint, {
      component: 'GraphQL Client',
      query: query.substring(0, 100), // Include truncated query for debugging
      variables: JSON.stringify(variables),
      errorType: 'graphql_request',
    });

    // Re-throw with user-friendly message
    const enhancedError = new Error(userMessage);
    (enhancedError as any).originalError = error;
    throw enhancedError;
  }
};
