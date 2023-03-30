import { ReactElement } from "react";
import { Link } from "@reach/router";
import { useState } from "react";
import { Icon, useMediaQuery } from "@material-ui/core";
import njLogo from "../njlogo.svg";
import { useTranslation } from "react-i18next";
import { UnstyledButton } from "./UnstyledButton";
import GlobalHeader from "./GlobalHeader";
import { BetaBanner } from "./BetaBanner";

const COUNSELING_URL = "https://nj.gov/labor/career-services/";

interface HandleClickInterface {
  currentTarget: HTMLAnchorElement;
}

export const Header = (): ReactElement => {
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
          <div className="fdr fac fjb height-100">
            <a href="/" className="link-format-black fin fac width-content">
              <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
              <h1 className="text-m bold">Training Explorer</h1>
            </a>
            <UnstyledButton onClick={toggleIsOpen} className="link-format-black">
              <Icon className="mrs">{isOpen ? "close" : "menu"}</Icon>
              <span className="sr-only">{t("Header.mobileMenuText")}</span>
            </UnstyledButton>
          </div>

          {isOpen && (
            <nav className="nav nav-mobile">
              <Link to="/" className="link-format-black nav-item pvm phd bvdcg" onClick={pageCheck}>
                <span className="container flex fac fjb">
                  Home
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/search"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToSearch")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/in-demand-occupations"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToInDemandOccupations")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/funding"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToFunding")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/faq"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToFAQ")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/training-provider-resources"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToTPResources")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={COUNSELING_URL}
                className="link-format-black nav-item pvm phd bbdcg"
              >
                <span className="container flex fac fjb">
                  {t("Header.mobileLinkToCounselors")}
                  <Icon>launch</Icon>
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </a>
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
              <li className="nav-item">
                <a href="/">
                  <span>
                    Home
                    <Icon>home</Icon>
                  </span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/search">
                  <span>{t("Header.linkToSearch")}</span>
                </a>
              </li>
              <li>
                <a href="/in-demand-occupations">
                  <span>{t("Header.linkToInDemandOccupations")}</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/funding">
                  <span>{t("Header.linkToFunding")}</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/faq">
                  <span>{t("Header.linkToFAQ")}</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/training-provider-resources">
                  <span>{t("Header.linkToTPResources")}</span>
                </a>
              </li>
              <li className="nav-item">
                <a href={COUNSELING_URL} target={"_blank"} rel={"noreferrer"}>
                  <span>
                    {t("Header.linkToCounselingText")} <Icon>launch</Icon>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  };

  return isDesktop ? nav() : mobileNav();
};
