"use client";

import { SupportedLanguages } from "@utils/types/types";

export const LangSelector = ({ lang }: { lang: SupportedLanguages }) => {
  return <button className="lang-selector">{lang}</button>;
};
