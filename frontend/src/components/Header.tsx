import { ReactElement } from "react";
import { Link } from "@reach/router";
import { useState } from "react";
import { Icon, useMediaQuery } from "@material-ui/core";
import njLogo from "../njlogo.svg";
import { useTranslation } from "react-i18next";
import { UnstyledButton } from "./UnstyledButton";
import { GlobalHeader } from "./GlobalHeader";
import { BetaBanner } from "./BetaBanner";
import { GlobalHeaderProps } from "../types/contentful";

interface HandleClickInterface {
  currentTarget: HTMLAnchorElement;
}

export const Header = (data: { mainNav: GlobalHeaderProps; globalNav: GlobalHeaderProps }) => {
  const isDesktop = useMediaQuery("(min-width:1025px)");
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const pageCheck = (event: HandleClickInterface): void => {
    if (event.currentTarget.getAttribute("href") === window.location.pathname) {
      setIsOpen(false);
    }
  };

  const mobileNav = (): ReactElement => {
    return (
      <header className="header" role="banner">
        <BetaBanner />
        <GlobalHeader />
        <div className="container height-100">
          <div className="basic-logo fdr fac fjb height-100">
            <a href="/" className="link-format-black fin fac width-content">
              <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
              <h1 className="text-m">Training Explorer</h1>
            </a>
            <UnstyledButton onClick={toggleIsOpen} className="link-format-black">
              <Icon className="mrs">{isOpen ? "close" : "menu"}</Icon>
              <span className="sr-only">{t("Header.mobileMenuText")}</span>
            </UnstyledButton>
          </div>

          {isOpen && (
            <nav className="main-nav nav nav-mobile">
              <ul>
                {data?.mainNav?.navMenus.topLevelItemsCollection.items.map(
                  ({ sys, copy, url, classes, screenReaderOnlyCopy }) => {
                    const isRelative = url.startsWith("/") || url.startsWith("#");
                    const isHome = url === "/";
                    return (
                      <li key={sys.id}>
                        {isRelative ? (
                          <Link
                            to={url}
                            className={`nav-item${classes ? ` ${classes}` : ""}`}
                            onClick={pageCheck}
                          >
                            <span>
                              {copy}
                              {screenReaderOnlyCopy && (
                                <span className="sr-only">{screenReaderOnlyCopy}</span>
                              )}
                              {isHome && <Icon>home</Icon>}
                            </span>
                          </Link>
                        ) : (
                          <a
                            href={url}
                            className={`nav-item${classes ? ` ${classes}` : ""}`}
                            onClick={pageCheck}
                          >
                            <span>
                              {copy}
                              {screenReaderOnlyCopy && (
                                <span className="sr-only">{screenReaderOnlyCopy}</span>
                              )}
                              <Icon>launch</Icon>
                            </span>
                          </a>
                        )}
                      </li>
                    );
                  }
                )}
              </ul>
            </nav>
          )}
        </div>
      </header>
    );
  };

  const nav = (): ReactElement => {
    return (
      <header className="header" role="banner">
        <BetaBanner />
        <GlobalHeader />

        <nav className="usa-nav-container">
          <div className="basic-logo" id="basic-logo">
            <a href="/">
              <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
              <h1 className="bold">{t("Header.title")}</h1>
            </a>
          </div>
        </nav>
        <nav aria-label="Primary navigation" className="main-nav">
          <div className="usa-nav-container">
            <ul>
              {data?.mainNav?.navMenus.topLevelItemsCollection.items.map(
                ({ sys, copy, url, classes, screenReaderOnlyCopy }) => {
                  const isRelative = url.startsWith("/") || url.startsWith("#");
                  const isHome = url === "/";
                  return (
                    <li key={sys.id} className={`nav-item${classes ? ` ${classes}` : ""}`}>
                      {isRelative ? (
                        <a href={url}>
                          <span>
                            {copy}
                            {screenReaderOnlyCopy && (
                              <span className="sr-only">{screenReaderOnlyCopy}</span>
                            )}
                            {isHome && <Icon>home</Icon>}
                          </span>
                        </a>
                      ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <span>
                            {copy}
                            {screenReaderOnlyCopy && (
                              <span className="sr-only">{screenReaderOnlyCopy}</span>
                            )}
                            <Icon>launch</Icon>
                          </span>
                        </a>
                      )}
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </nav>
      </header>
    );
  };

  return isDesktop ? nav() : mobileNav();
};
