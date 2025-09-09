import axios from "axios";

export const searchAPI = axios.create({
  withCredentials: true,
  baseURL: `https://${process.env.CE_ENVIRONMENT}.credentialengine.org`,
  responseType: "json",
  timeout: 120000, // 2 minute timeout for search operations
  headers: {
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "Content-Type, Authorization",
    Authorization: `Bearer ${process.env.CE_AUTH_TOKEN}`,
    "Content-type": "application/json",
  },
});

export const getRecordAPI = axios.create({
  withCredentials: false,
  baseURL: process.env.CE_ENVIRONMENT == "sandbox" ? `https://${process.env.CE_ENVIRONMENT}.credentialengineregistry.org` : `https://credentialengineregistry.org`,
  responseType: "json",
  timeout: 60000, // 1 minute timeout for record fetching
});

const errorHandler = (error: { response: { status: unknown } }) => {
  const statusCode = error.response?.status;

  // Handle 503 Service Unavailable errors more gracefully
  if (statusCode === 503) {
    console.warn(`⚠️ Service temporarily unavailable (503), continuing with cached data`);
    return Promise.resolve({ data: null }); // Return null data instead of rejecting
  }

  if (statusCode && statusCode !== 401) {
    console.error(error);
  }

  return Promise.reject(error);
};

// Add retry logic for search API
searchAPI.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  
  // Retry 503 errors up to 2 times with exponential backoff
  if (error.response?.status === 503 && (!config._retryCount || config._retryCount < 2)) {
    config._retryCount = (config._retryCount || 0) + 1;
    const delay = Math.pow(2, config._retryCount) * 1000; // 2s, 4s
    
    console.log(`🔄 Retrying search API request (attempt ${config._retryCount}) after ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return searchAPI(config);
  }
  
  return errorHandler(error);
});

// Handle 503 errors gracefully for record API (don't retry to avoid overloading)
getRecordAPI.interceptors.response.use(undefined, (error) => {
  if (error.response?.status === 503) {
    console.warn(`⚠️ Provider record service unavailable (503), using fallback data`);
    return Promise.resolve({ data: null }); // Return null data to continue processing
  }
  return errorHandler(error);
});
