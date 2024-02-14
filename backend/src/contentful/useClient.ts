import { contentfulClient } from './client';
import { getContentfulAccessToken } from '../utils/secretManager';
import NodeCache from 'node-cache';

// Define cache for storing the API key
const apiKeyCache = new NodeCache();
const REFRESH_INTERVAL = 3600; // Cache refresh interval in seconds

// Define types for GraphQL query and variables
type GraphQLQuery = string;
type GraphQLVariables = Record<string, unknown>;

// Define a generic type for the Contentful GraphQL response
interface ContentfulGraphQLResponse<T> {
    data?: T;
    errors?: {
        message: string;
        locations?: { line: number; column: number }[];
        path?: string[];
        extensions?: any;
    }[];
}

// Function to get or refresh the API key
const getApiKey = async (): Promise<string> => {
    let apiKey: string | undefined = apiKeyCache.get('CACHE_KEY');
    if (!apiKey) {
        console.log('Cache missing, fetching from AWS Secrets Manager');
        apiKey = await getContentfulAccessToken();
        apiKeyCache.set('CACHE_KEY', apiKey, REFRESH_INTERVAL);
    }
    return apiKey;
};

// Function to use the Contentful client with specific query and variables
export const useClient = async <T>({query, variables}: {query: GraphQLQuery, variables: GraphQLVariables}): Promise<ContentfulGraphQLResponse<T>> => {
    try {
        const accessToken: string = await getApiKey();
        // Ensure contentfulClient is typed to return ContentfulGraphQLResponse<T>
        const result = await contentfulClient({ query, accessToken, variables }) as ContentfulGraphQLResponse<T>;
        return result;
    } catch (error: unknown) {
        console.error(error);
        // Perform a type check or assertion to safely access error properties
        if (error instanceof Error) {
            return { errors: [{ message: error.message }] };
        }
        return { errors: [{ message: 'An error occurred' }] };
    }
};
