import React, { ReactElement } from "react";
import { Link } from "@reach/router";
import { useState } from "react";
import { Icon, useMediaQuery } from "@material-ui/core";
import { UnstyledButton } from "../components/UnstyledButton";
import njLogo from "../njlogo.svg";
import { HeaderStrings } from "../localizations/HeaderStrings";

interface HandleClickInterface {
  currentTarget: HTMLAnchorElement;
}

export const Header = (): ReactElement => {
  const isDesktop = useMediaQuery("(min-width:992px)");
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
        <div className="container height-100">
          <div className="fdr fac fjb height-100">
            <a href="/" className="link-format-black fin fac width-content">
              <img className="mrd" src={njLogo} alt="New Jersey innovation logo" />
              <h1 className="text-m bold">Training Explorer</h1>
            </a>
            <UnstyledButton onClick={toggleIsOpen} className="link-format-black">
              <Icon className="mrs">{isOpen ? "close" : "menu"}</Icon>
              {HeaderStrings.mobileMenuText}
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
                  {HeaderStrings.linkToSearch}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/explorer"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {HeaderStrings.mobileLinkToExplorers}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/counselor"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {HeaderStrings.mobileLinkToCounselors}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/training-provider"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {HeaderStrings.mobileLinkToTrainingProviders}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
            </nav>
          )}
        </div>
      </header>
    );
  };

  const nav = (): ReactElement => {
    return (
      <header className="header" role="banner">
        <div className="container height-100">
          <nav className="nav">
            <div>
              <a href="/" className="link-format-black fin fac width-content">
                <img className="mrd" src={njLogo} alt="New Jersey innovation logo" />
                <h1 className="text-m bold">{HeaderStrings.title}</h1>
              </a>
            </div>

            <Link to="/search" className="link-format-black">
              {HeaderStrings.linkToSearch}
            </Link>
            <Link to="/in-demand-occupations" className="link-format-black">
              {HeaderStrings.linkToInDemandOccupations}
            </Link>
            <Link to="/funding" className="link-format-black">
              {HeaderStrings.linkToFunding}
            </Link>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={HeaderStrings.linkToCounseling}
              className="link-format-black fin fac"
            >
              {HeaderStrings.linkToCounselingText}&nbsp;
              <Icon>launch</Icon>
            </a>
          </nav>
        </div>
      </header>
    );
  };

  return isDesktop ? nav() : mobileNav();
};
