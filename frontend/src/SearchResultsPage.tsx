import React, {ReactElement, useEffect, useState} from "react";
import {Client} from "./domain/Client";
import {Program} from "./domain/Program";
import {formatMoney} from "accounting";
import {Searchbar} from "./Searchbar";
import {navigate, RouteComponentProps} from "@reach/router";

interface Props extends RouteComponentProps {
  client: Client;
  searchQuery?: string;
}

const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const queryToSearch = props.searchQuery ? props.searchQuery : '';
    props.client.getProgramsByQuery(queryToSearch, {
      onSuccess: setPrograms,
      onError: () => {},
    });
  }, [props.searchQuery, props.client]);

  const formatPercentEmployed = (percentEmployed: number | null): string => {
    if (percentEmployed === null) {
      return "--";
    }

    return (Math.trunc(percentEmployed * 1000) / 10).toFixed(1) + "%";
  };

  return (
    <>
      <header className="header pvm prd plxl fdr fac">
        <h3 className="mrl">
          New Jersey
          <br />
          Training Explorer
        </h3>
        <Searchbar
          onSearch={(searchQuery: string): Promise<void> => navigate(`/search/${searchQuery}`)}
          initialValue={props.searchQuery}
        />
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
              <tr key={it.id}>
                <td>{it.name}</td>
                <td className="number">{formatPercentEmployed(it.percentEmployed)}</td>
                <td className="number">{formatMoney(it.totalCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SearchResultsPage;
