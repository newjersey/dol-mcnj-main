import { ReactElement } from "react";
import { useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import njLogo from "../njlogo.svg";
import { useTranslation } from "react-i18next";
import { UnstyledButton } from "./UnstyledButton";
import { GlobalHeader } from "./GlobalHeader";
import { BetaBanner } from "./BetaBanner";
import { NavMenuData } from "../types/contentful";
import { NavMenu } from "./modules/NavMenu";

export const Header = (data: { mainNav?: NavMenuData; globalNav?: NavMenuData }) => {
  const isDesktop = useMediaQuery("(min-width:1025px)");
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const mobileNav = (): ReactElement => {
    return (
      <div className="mobile-menu container height-100">
        <div className="basic-logo fdr fac fjb height-100">
          <a
            href="/"
            className="link-format-black fin fac width-content"
            aria-label="Training Explorer"
          >
            <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
            <h1 className="text-m">Training Explorer</h1>
          </a>
          <UnstyledButton onClick={toggleIsOpen} className="link-format-black">
            <div className={`toggle ${isOpen ? "open" : "closed"}`}>
              <span />
              <span />
              <span />
            </div>
            <span className="sr-only">{t("Header.mobileMenuText")}</span>
          </UnstyledButton>
        </div>
        {isOpen && (
          <NavMenu
            id="headerNavMobile"
            menu={data?.mainNav}
            className="main-nav nav nav-mobile"
            icons
          />
        )}
      </div>
    );
  };

  const nav = (): ReactElement => {
    return (
      <>
        <nav id="usaNav" className="usa-nav-container">
          <div className="basic-logo" id="basic-logo">
            <a href="/" aria-label={t("Header.title")}>
              <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
              <h1 className="bold">{t("Header.title")}</h1>
            </a>
          </div>
        </nav>
        <NavMenu
          id="headerNavDesktop"
          menu={data?.mainNav}
          label="Primary navigation"
          className="main-nav"
          innerClassName="usa-nav-container"
          icons
        />
      </>
    );
  };

  return (
    <header className="header" role="banner">
      <BetaBanner />
      <GlobalHeader items={data?.globalNav} />
      {isDesktop ? <>{nav()}</> : <>{mobileNav()}</>}
    </header>
  );
};
