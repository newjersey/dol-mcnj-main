import React from "react";
import { TrainingPage } from "./TrainingPage";
import { TempNotFound } from "../error/TempNotFound";
import { NotFoundPage } from "../error/NotFoundPage";
import { Client } from "../domain/Client";

interface Props {
  id: string;
  path?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: Client; // Replace with the actual type for `client, sorry, feeling laaaaazy rn
}

export const TrainingPageRouter = ({ id, client }: Props) => {
  const isCTID =
    /^ce-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  const isProgramID = /^\d{5}$/.test(id);

  if (isCTID) {
    return <TrainingPage id={id} path="/training/:id" client={client} />;
  } else if (isProgramID) {
    return (
      <TempNotFound client={client} heading="Temporary URL Change">
        <>
          <p>
            We are in the process of updating our data structure, which may result in temporary
            changes to the URL of the page you're trying to access. Please return to the Training
            Explorer search page to find the training you're looking for.
          </p>
          <p>
            <a className="link-format-blue" href="/training/search/">
              Training Explorer Search
            </a>
          </p>
          <p>
            <a className="link-format-blue" href="/contact">
              Contct Us
            </a>
          </p>
        </>
      </TempNotFound>
    );
  } else {
    return <NotFoundPage client={client} heading="Training Not Found" />;
  }
};
