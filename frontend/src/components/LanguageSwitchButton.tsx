import React, { ReactElement } from "react";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

export const LanguageSwitchButton = (): ReactElement => {
  const { i18n } = useTranslation();

  return (
    <Button
      variant="secondary"
      className="language-switch-buttton width-auto"
      onClick={() => i18n.changeLanguage(i18n.language === "en" ? "es" : "en")}
    >
      {i18n.language === "en" ? "Español" : "English"}
    </Button>
  );
};
