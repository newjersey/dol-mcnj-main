import {contentfulClient} from './client'
import {getContentfulAccessToken} from '../utils/secretManager'
import NodeCache from 'node-cache'

const apiKeyCache = new NodeCache
const REFRESH_INTERVAL = 3600
const getApiKey = async (): Promise<string> => {
    let apiKey:string | undefined = apiKeyCache.get('CACHE_KEY')
    if(!apiKey) {
        console.log('cache missing, fetching from AWS Secrets Manager');
        apiKey = await getContentfulAccessToken();
        apiKeyCache.set('CACHE_KEY', apiKey, REFRESH_INTERVAL);
    }
    return apiKey
}

export const useClient = async ({query, variables} : {query: any, variables: any}): Promise<object> => {
        try {
            const accessToken:string = await getApiKey()
            const result: any = await contentfulClient({ query, accessToken, variables });
            return result
        } catch (error) {
            console.error(error);
            return {};
        }
}
        