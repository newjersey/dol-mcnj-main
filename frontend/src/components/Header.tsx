import { ReactElement } from "react";
import { useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import njLogo from "../njlogo.svg";
import { useTranslation } from "react-i18next";
import { UnstyledButton } from "./UnstyledButton";
import { GlobalHeader } from "./GlobalHeader";
import { NavMenuData } from "../types/contentful";
import { NavMenu } from "./modules/NavMenu";
import { LinkObject } from "./modules/LinkObject";

export const Header = (data: { mainNav?: NavMenuData; globalNav?: NavMenuData }) => {
  const isDesktop = useMediaQuery("(min-width:769px)");
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
            aria-label={process.env.REACT_APP_SITE_NAME}
          >
            <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
            <h1 className="text-m">{process.env.REACT_APP_SITE_NAME}</h1>
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
          <div className="main-nav__container">
            <NavMenu
              id="headerNavMobile"
              menu={data?.mainNav}
              className="main-nav nav nav-mobile"
              icons
            />
            <LinkObject
              className="nav-item contact-us"
              copy="Contact Us"
              icons={true}
              url="/contact"
            />
          </div>
        )}
      </div>
    );
  };

  const nav = (): ReactElement => {
    return (
      <>
        <nav id="usaNav" className="usa-nav-container">
          <div className="basic-logo" id="basic-logo">
            <a href="/" aria-label={process.env.REACT_APP_SITE_NAME}>
              <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
              <h1 className="bold">{process.env.REACT_APP_SITE_NAME}</h1>
            </a>
          </div>
        </nav>

        <div className="main-nav__container">
          <div className="main-nav__links">
            <NavMenu
              id="headerNavDesktop"
              menu={data?.mainNav}
              label="Primary navigation"
              className="main-nav"
              innerClassName="usa-nav-container"
              icons
            />
            <LinkObject
              className="nav-item contact-us"
              copy="Contact Us"
              icons={true}
              url="/contact"
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <header className="header" role="banner">
      <GlobalHeader items={data?.globalNav} />
      {isDesktop ? <>{nav()}</> : <>{mobileNav()}</>}
    </header>
  );
};
