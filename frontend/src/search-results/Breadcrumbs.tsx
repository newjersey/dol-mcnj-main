import { ReactElement } from "react";

import { ArrowLeft } from "@phosphor-icons/react";

export const Breadcrumbs = (): ReactElement => {
  return (
    <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
      <ol className="usa-breadcrumb__list">
        <li className="usa-breadcrumb__list-item">
          <a className="usa-breadcrumb__link" href="/">
            Home
          </a>
        </li>
        <li className="usa-breadcrumb__list-item">
          <a className="usa-breadcrumb__link" href="/training">
            Training Explorer
          </a>
        </li>
        <li className="usa-breadcrumb__list-item use-current" aria-current="page">
          <span data-testid="title">Advanced Search</span>
        </li>
      </ol>
      <a className="back-link" href="/training">
        <ArrowLeft size={24} />
        Back
      </a>
    </nav>
  )
};