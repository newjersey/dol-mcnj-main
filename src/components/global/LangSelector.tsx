"use client";

import { SupportedLanguages } from "@utils/types/types";

export const LangSelector = ({
  lang = "en",
}: {
  lang?: SupportedLanguages;
}) => {
  return <button className="lang-selector">{lang}</button>;
};
