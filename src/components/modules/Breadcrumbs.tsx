"use client";
import { ArrowLeft } from "@phosphor-icons/react";
import { colors } from "@utils/settings";
import { LinkProps } from "@utils/types";

interface BreadcrumbsProps {
  className?: string;
  crumbs: LinkProps[];
  pageTitle: string;
  style?: React.CSSProperties;
}

const Breadcrumbs = ({
  crumbs,
  className,
  pageTitle,
  style,
}: BreadcrumbsProps) => {
  return (
    <nav
      style={style}
      className={`usa-breadcrumb${className ? ` ${className}` : ""}`}
      aria-label="Breadcrumbs"
    >
      <ArrowLeft className="backIcon" color={colors.primary} />

      <ol className="usa-breadcrumb__list">
        {crumbs.map((crumb) => {
          return (
            <li className="usa-breadcrumb__list-item" key={crumb.copy}>
              {crumb.url ? (
                <a className="usa-breadcrumb__link" href={crumb.url}>
                  {crumb.copy}
                </a>
              ) : (
                crumb.copy
              )}
            </li>
          );
        })}
        <li
          className="usa-breadcrumb__list-item use-current"
          aria-current="page"
        >
          <span data-testid="title">{pageTitle}</span>
        </li>
      </ol>
    </nav>
  );
};

export { Breadcrumbs };
