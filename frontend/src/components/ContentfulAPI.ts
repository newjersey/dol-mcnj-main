/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

interface Params {
  baseUrl: string;
  headers: any;
  method: string;
}

const config: Params = {
  baseUrl: `https://${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_SPACE_ID}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_DELIVERY_API}`,
  },
  method: "post",
};

export const api = async (url: string, data: any): Promise<any> => {
  return await axios({
    ...config,
    url: `${config.baseUrl}`,
    data,
  })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        status: error.status,
        data: error.response,
      };
    });
};
