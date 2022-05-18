import React, { ReactElement } from "react";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";

export const Footer = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <footer className="bg-footer-grey pvm width-100 fdc fac">
      <div>
        <Link className="link-format-blue text-s" to="/privacy-policy">
          {t("Footer.privacyPolicyLinkLabel")}
        </Link>
        {" | "}
        <Link className="link-format-blue text-s" to="/terms-of-service">
          {t("Footer.termsOfServiceLinkLabel")}
        </Link>
      </div>

      <p className="text-s">{t("Footer.madeWithMessage")}</p>
    </footer>
  );
};
