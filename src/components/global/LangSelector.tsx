"use client";

import { Button } from "@components/modules/Button";
import { SupportedLanguages } from "@utils/types/types";
import { useEffect, useState } from "react";

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null; // Prevent SSR error

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

export const LangSelector = () => {
  const [lang, setLang] = useState<SupportedLanguages>("en");

  // Get cookie value only on the client side
  useEffect(() => {
    const savedLang = getCookie("lang") as SupportedLanguages;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "en" ? "es" : "en";
    document.cookie = `lang=${newLang}; path=/`; // Ensure cookie is set for the whole site
    setLang(newLang); // Update state immediately
    window.location.reload(); // Refresh to apply changes
  };

  return (
    <Button
      type="button"
      className="langSelector"
      defaultStyle="secondary"
      onClick={toggleLang}
    >
      {lang === "en" ? "Español" : "English"}
    </Button>
  );
};
