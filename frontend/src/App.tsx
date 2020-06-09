import React, { ReactElement, useEffect, useState } from "react";
import { Client } from "./Client";

interface Props {
  client: Client;
}

const App = (props: Props): ReactElement<Props> => {
  const [programs, setPrograms] = useState<string[]>([]);

  useEffect(() => {
    props.client.getPrograms({
      onSuccess: setPrograms,
      onError: () => {},
    });
  }, [props.client]);

  return (
    <div className="pad">
      <h1>Training Programs Available to New Jerseyans</h1>
      <ul>
        {programs.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
