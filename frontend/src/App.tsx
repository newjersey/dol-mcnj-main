import React, { ReactElement, useEffect, useState } from "react";
import { Client } from "./domain/Client";
import { Program } from "./domain/Program";
import { formatMoney } from "accounting";

interface Props {
  client: Client;
}

const App = (props: Props): ReactElement<Props> => {
  const [programs, setPrograms] = useState<Program[]>([]);

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
          <li key={it.name}>
            <b>{it.name}</b>: {formatMoney(it.totalCost)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
