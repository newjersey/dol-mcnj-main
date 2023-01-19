import axios from "axios";

export const searchAPI = axios.create({
  withCredentials: false,
  baseURL: `https://${process.env.CE_ENVIRONMENT}.credentialengine.org`,
  responseType: "json",
  headers: {
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "Content-Type, Authorization",
    Authorization: `Bearer ${process.env.CE_AUTH_TOKEN}`,
    "Content-type": "application/json",
  },
});

export const getRecordAPI = axios.create({
  withCredentials: false,
  baseURL: `https://credentialengineregistry.org`,
  responseType: "json"
})

const errorHandler = (error: { response: { status: unknown } }) => {
  const statusCode = error.response?.status;

  if (statusCode && statusCode !== 401) {
    console.error(error);
  }

  return Promise.reject(error);
};

searchAPI.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

getRecordAPI.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

/*

curl "https://sandbox.credentialengine.org/assistant/search/ctdl" \
  -H "Origin: http://localhost:3000" \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: Content-Type, Authorization' \
  -H "Authorization: ***REMOVED***" \
  -H 'Content-Type: application/json' \
  -d "{'Query': { '@type': 'ceterms:Certificate' }, 'Skip': 0, 'Take': 5, 'Sort': '^search:recordCreated' }"
 
*/
