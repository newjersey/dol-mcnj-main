import { ReactElement } from "react";
import { Client } from "../domain/Client";
import { CareerPathwaysPage } from "./CareerPathwaysPage";

export const CareerPathwaysRoutes = ({ client }: { client: Client }): ReactElement => {
  return (
    <>
      <CareerPathwaysPage
        path="/career-pathways/manufacturing"
        client={client}
        id="manufacturing"
      />
      <CareerPathwaysPage path="/career-pathways/healthcare" client={client} id="healthcare" />
      <CareerPathwaysPage path="/career-pathways/tdl" client={client} id="tdl" />
    </>
  );
};
