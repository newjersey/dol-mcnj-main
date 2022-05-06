import React, { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { ErrorPage } from "./ErrorPage";
import { useTranslation } from "react-i18next";

export const NotFoundPage = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();

  return (
    <ErrorPage headerText={t("ErrorPageStrings.notFoundHeader")}>
      <>
        <p>{t("ErrorPageStrings.notFoundText")}</p>
        <p>
          <a className="link-format-blue" href="/">
            {t("ErrorPageStrings.notFoundLink1")}
          </a>
        </p>
        <p>
          <a
            className="link-format-blue"
            href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
          >
            {t("ErrorPageStrings.notFoundLink2")}
          </a>
        </p>
      </>
    </ErrorPage>
  );
};
