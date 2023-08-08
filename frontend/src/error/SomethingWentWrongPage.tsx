import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ErrorPage } from "./ErrorPage";
import { Client } from "../domain/Client";

interface Props {
  client: Client;
  heading?: string;
  children?: ReactElement;
}

export const SomethingWentWrongPage = (props: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <ErrorPage
      className="warning"
      headerText={props.heading || t("ErrorPage.somethingWentWrongHeader")}
      client={props.client}
    >
      {props.children ? <>{props.children}</> : <p>{t("ErrorPage.somethingWentWrongText")}</p>}
    </ErrorPage>
  );
};
