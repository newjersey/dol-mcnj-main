import { AxiosResponse } from "axios";
import { GetAllCertificates } from "../types";
import { api } from '../../credentialengine/CredentialEngineConfig'

export const credentialEngineFactory = (
  getAllCertificates: GetAllCertificates
): GetAllCertificates => {
  return async (searchQuery: string): Promise<AxiosResponse> => {

    const gateway = `/assistant/search/ctdl`;
    
    return (

      await api.request({
        url: `${gateway}`,
        method: 'post',
        data: {
          'Query': {
            '@type': 'ceterms:Certificate'
          },
          'Skip': 0,
          'Take': 5,
          'Sort': '^search:recordCreated'
        },
        // retrieving the signal value by using the property name
        // signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
        
      })

    )
    
  };
};