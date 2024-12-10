import React from "react";
import { TrainingPage } from "./TrainingPage";
import { TempNotFound } from "../error/TempNotFound";
import { NotFoundPage } from "../error/NotFoundPage";
import { Client } from "../domain/Client";
import { useTranslation } from "react-i18next";

interface Props {
  id: string;
  path?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: Client; // Replace with the actual type for `client, sorry, feeling laaaaazy rn
}

export const TrainingPageRouter = ({ id, client }: Props) => {
  const { t } = useTranslation();
  const isCTID =
    /^ce-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  const isProgramID = /^\d{5}$/.test(id);

  if (isCTID) {
    return <TrainingPage id={id} path="/training/:id" client={client} />;
  } else if (isProgramID) {
    return <TempNotFound client={client} />;
  } else {
    return <NotFoundPage client={client} heading={t("ErrorPage.notFoundHeaderTraining")} />;
  }
};
