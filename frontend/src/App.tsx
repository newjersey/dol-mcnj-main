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

  const formatPercentEmployed = (percentEmployed: number | null): string => {
    if (percentEmployed === null) {
      return "--";
    }

    return (Math.trunc(percentEmployed * 1000) / 10).toFixed(1) + "%";
  };

  return (
    <>
      <header className="header pvm prd plxl">
        <h3>
          New Jersey
          <br />
          Training Explorer
        </h3>
      </header>
      <div className="mhxl mvl">
        <table>
          <thead>
            <tr>
              <th>Program Name</th>
              <th className="number">Employment Rate</th>
              <th className="number">Cost</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((it) => (
              <tr key={it.name}>
                <td>{it.name}</td>
                <td className="number">
                  {formatPercentEmployed(it.percentEmployed)}
                </td>
                <td className="number">{formatMoney(it.totalCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App;
