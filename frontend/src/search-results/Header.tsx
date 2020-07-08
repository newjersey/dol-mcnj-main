import React, { ReactElement } from "react";
import njLogo from "../njlogo.svg";

export const Header = (): ReactElement => {
  return (
    <header className="header fdr fac">
      <div className="container fdr fac">
        <a href="/">
          <img className="nj-logo-header mrd" src={njLogo} alt="New Jersey innovation logo" />
        </a>
        <a href="/" className="no-link-format">
          <h1 className="mrl text-xl">Training Explorer</h1>
        </a>
      </div>
    </header>
  );
};
