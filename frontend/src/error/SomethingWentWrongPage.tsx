import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ErrorPage } from "./ErrorPage";

export const SomethingWentWrongPage = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <ErrorPage headerText={t("ErrorPageStrings.somethingWentWrongHeader")}>
      <p>{t("ErrorPageStrings.somethingWentWrongText")}</p>
    </ErrorPage>
  );
};
