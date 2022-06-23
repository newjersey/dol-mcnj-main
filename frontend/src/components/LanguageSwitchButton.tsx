import React, { ReactElement } from "react";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";
import { logEvent } from "../analytics";

export const LanguageSwitchButton = (): ReactElement => {
  const { i18n } = useTranslation();

  function onClick() {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
    logEvent("General", "Switched language", newLang);
  }

  return (
    <Button variant="secondary" className="language-switch-buttton width-auto" onClick={onClick}>
      {i18n.language === "en" ? "Español" : "English"}
    </Button>
  );
};
