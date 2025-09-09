import React, { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { ErrorPage } from "./ErrorPage";
import { useTranslation } from "react-i18next";
import { Client } from "../domain/Client";
import { Helmet } from "react-helmet-async";

interface Props extends RouteComponentProps {
  client: Client;
  heading?: string;
  children?: ReactElement;
}

export const NotFoundPage = (props: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <ErrorPage headerText={props.heading || t("ErrorPage.notFoundHeader")} client={props.client}>
      {props.children ? (
        <>{props.children}</>
      ) : (
        <>
          <Helmet>
            <meta name="robots" content="noindex" />
            <title>Page not found – My Career NJ</title>
          </Helmet>
          <p>{t("ErrorPage.notFoundText")}</p>
          <p>
            <a className="link-format-blue" href="/training/search/">
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
      )}
    </ErrorPage>
  );
};
