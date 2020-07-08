import React, { ReactElement, useEffect, useState } from "react";
import { Client } from "../domain/Client";
import { Program } from "../domain/Program";
import { Searchbar } from "../components/Searchbar";
import { navigate, RouteComponentProps } from "@reach/router";
import { Header } from "./Header";
import { ProgramCard } from "./ProgramCard";
import { useMediaQuery } from "@material-ui/core";

interface Props extends RouteComponentProps {
  client: Client;
  searchQuery?: string;
}

export const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const isWidescreen = useMediaQuery("(min-width:992px)");
  const isMobile = useMediaQuery("(max-width:768px)");
  const shouldStackSearchButton = isMobile || isWidescreen;

  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const queryToSearch = props.searchQuery ? props.searchQuery : "";
    props.client.getProgramsByQuery(queryToSearch, {
      onSuccess: setPrograms,
      onError: () => {},
    });
  }, [props.searchQuery, props.client]);

  return (
    <>
      <Header />

      <div className="container search-container">
        <div className="row">
          <div className="col-md-4">
            <div className="bg-light-green sidebar pam">
              <div className="search-wrapper">
                <Searchbar
                  onSearch={(searchQuery: string): Promise<void> =>
                    navigate(`/search/${searchQuery}`)
                  }
                  initialValue={props.searchQuery}
                  stacked={shouldStackSearchButton}
                />
              </div>
            </div>
          </div>
          <div className="col-md-8 col-md-offset-4 offset-col">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
