/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
interface Params {
  baseUrl: string;
  headers: any;
  method: string;
}
const config: Params = {
  baseUrl: `https://${process.env.BASE_URL}/${process.env.SPACE_ID}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.DELIVERY_API}`,
  },
  method: "post",
};
export const api = async (data: any): Promise<any> => {
  return await axios({
    ...config,
    url: `${config.baseUrl}/`,
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
