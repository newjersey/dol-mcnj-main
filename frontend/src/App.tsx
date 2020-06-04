import React, {ReactElement, useEffect, useState} from 'react';
import axios, {AxiosResponse} from "axios";

interface PingResponse {
    message: string;
}

const App = (): ReactElement => {
  const [response, setReponse] = useState("");

  useEffect(() => {
    axios.get('/api/ping')
        .then((response: AxiosResponse<PingResponse>) => {
            setReponse(response.data.message)
        })
  });

  return (
    <div className="pad">
      <h1>the server says:</h1>
      <p>{response}</p>
    </div>
  );
};

export default App;
