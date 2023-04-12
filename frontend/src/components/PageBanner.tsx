import dayjs from "dayjs";
import { PageBannerProps } from "../types/contentful";
import { ContentfulRichText } from "./ContentfulRichText";

export const PageBanner = ({
  title,
  message,
  breadcrumbsCollection,
  breadcrumbIcon,
  ctaHeading,
  ctaLinksCollection,
  date,
}: PageBannerProps) => {
  return (
    <section className="page-banner">
      <div className="container">
        <div className="top-nav">
          <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
            {breadcrumbIcon && <img src={breadcrumbIcon.url} alt="" />}
            <ol className="usa-breadcrumb__list">
              {breadcrumbsCollection.items.map((crumb) => {
                return (
                  <li className="usa-breadcrumb__list-item" key={crumb.sys?.id}>
                    <a className="usa-breadcrumb__link" href={crumb.url}>
                      {crumb.copy}
                    </a>
                  </li>
                );
              })}
              <li className="usa-breadcrumb__list-item use-current" aria-current="page">
                <span>{title}</span>
              </li>
            </ol>
          </nav>
          {date && (
            <div className="date">
              Last Updated
              <br />
              {dayjs(date).format("MM/DD/YYYY")}
            </div>
          )}
        </div>

        <div className="copy">
          <div className="heading">
            <h1>{title}</h1>
            {message && <ContentfulRichText document={message.json} />}
          </div>
          {ctaHeading && ctaLinksCollection && (
            <div className="cta-block">
              <p>{ctaHeading}</p>
              <ul className="unstyled">
                {ctaLinksCollection.items.map((link) => (
                  <li key={link.sys?.id}>
                    <a className="usa-button usa-button--secondary" href={link.url}>
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
