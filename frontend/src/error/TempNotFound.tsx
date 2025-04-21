import React, { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { ErrorPage } from "./ErrorPage";
import { useTranslation } from "react-i18next";
import { Client } from "../domain/Client";

interface Props extends RouteComponentProps {
  client: Client;
  heading?: string;
  children?: ReactElement;
}

export const TempNotFound = (props: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <ErrorPage
      headerText={props.heading || t("ErrorPage.notFoundHeaderTemp")}
      client={props.client}
    >
      {props.children ? (
        <>{props.children}</>
      ) : (
        <>
          <p>{t("ErrorPage.notFoundTextTemp")}</p>
          <p>
            <a className="link-format-blue" href="/training">
              {t("ErrorPage.notFoundLink1Temp")}
            </a>
          </p>
          <p>
            <a className="link-format-blue" href="/contact">
              {t("ErrorPage.notFoundLink2Temp")}
            </a>
          </p>
        </>
      )}
    </ErrorPage>
  );
};
