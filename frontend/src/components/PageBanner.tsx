import dayjs from "dayjs";
import { PageBannerProps } from "../types/contentful";
import { ContentfulRichText } from "./ContentfulRichText";
import { Icon } from "@material-ui/core";
import { Selector } from "../svg/Selector";

export const PageBanner = ({
  title,
  breadcrumbTitle,
  message,
  breadcrumbsCollection,
  section,
  ctaHeading,
  ctaLinksCollection,
  theme = "green",
  date,
}: PageBannerProps) => {
  const svgColor =
    theme === "green"
      ? "#198042"
      : theme === "blue"
      ? "#0066AA"
      : theme === "purple"
      ? "#5240AA"
      : "#2E6276";

  return (
    <section className={`page-banner theme-${theme}`}>
      <div className="container plus">
        <div className="top-nav">
          <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
            <Icon>keyboard_backspace</Icon>
            <Selector name={section} color={svgColor} />
            <ol className="usa-breadcrumb__list">
              {breadcrumbsCollection?.items.map((crumb) => {
                return (
                  <li className="usa-breadcrumb__list-item" key={crumb.sys?.id}>
                    <a className="usa-breadcrumb__link" href={crumb.url}>
                      {crumb.copy}
                    </a>
                  </li>
                );
              })}
              <li className="usa-breadcrumb__list-item use-current" aria-current="page">
                <span data-testid="title">{breadcrumbTitle || title}</span>
              </li>
            </ol>
          </nav>
          {date && (
            <div data-testid="date" className="date">
              Last Updated {dayjs(date).format("MM/DD/YYYY")}
            </div>
          )}
        </div>

        <div className="copy">
          <div className="heading">
            <h1>{title}</h1>
            {message && <ContentfulRichText document={message.json} />}
          </div>
          {ctaLinksCollection && (
            <div className="cta-block">
              {ctaHeading && <p>{ctaHeading}</p>}
              <ul className="unstyled">
                {ctaLinksCollection.items.map((link, index: number) => (
                  <li key={link.sys?.id}>
                    <a
                      className={`usa-button ${index > 0 ? " usa-button--outline" : ""}`}
                      href={link.url}
                    >
                      {link.copy}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
