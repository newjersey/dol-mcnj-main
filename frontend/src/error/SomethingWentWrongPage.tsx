import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ErrorPage } from "./ErrorPage";
import { Client } from "../domain/Client";

interface Props {
  client: Client;
}

export const SomethingWentWrongPage = (props: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <ErrorPage headerText={t("ErrorPage.somethingWentWrongHeader")} client={props.client}>
      <p>{t("ErrorPage.somethingWentWrongText")}</p>
    </ErrorPage>
  );
};
