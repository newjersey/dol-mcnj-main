import React, { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { ErrorPage } from "./ErrorPage";
import { useTranslation } from "react-i18next";
import { Client } from "../domain/Client";

interface Props extends RouteComponentProps {
  client: Client;
}

export const NotFoundPage = (props: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <ErrorPage headerText={t("ErrorPage.notFoundHeader")} client={props.client}>
      <>
        <p>{t("ErrorPage.notFoundText")}</p>
        <p>
          <a className="link-format-blue" href="/">
            {t("ErrorPage.notFoundLink1")}
          </a>
        </p>
        <p>
          <a
            className="link-format-blue"
            href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
          >
            {t("ErrorPage.notFoundLink2")}
          </a>
        </p>
      </>
    </ErrorPage>
  );
};
