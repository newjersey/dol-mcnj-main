import { PageBannerProps } from "../types/contentful";
import { ContentfulRichText } from "./ContentfulRichText";
import { Icon } from "@material-ui/core";

export const PageBanner = ({
  title,
  breadcrumbTitle,
  message,
  noCrumbs = false,
  description,
  breadcrumbsCollection,
  ctaHeading,
  ctaLinksCollection,
  theme = "green",
}: PageBannerProps) => {
  return (
    <section className={`page-banner theme-${theme}${noCrumbs ? " no-crumbs" : ""}`}>
      <div className="container plus">
        {!noCrumbs && (
          <div className="top-nav">
            <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
              <Icon>keyboard_backspace</Icon>
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
          </div>
        )}

        <div className="copy">
          <div className="heading">
            <h1>{title}</h1>
            {message && <ContentfulRichText document={message.json} />}
            {description && <p>{description}</p>}
          </div>
          {ctaLinksCollection && ctaLinksCollection.items.length > 0 && (
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
