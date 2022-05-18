import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ErrorPage } from "./ErrorPage";

export const SomethingWentWrongPage = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <ErrorPage headerText={t("ErrorPage.somethingWentWrongHeader")}>
      <p>{t("ErrorPage.somethingWentWrongText")}</p>
    </ErrorPage>
  );
};
