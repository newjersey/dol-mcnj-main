import { Fragment, ReactElement } from "react";
import { RightArrow } from "../svg/RightArrow";
import { ContentfulRichText as RichTextProps } from "../types/contentful";
import { ContentfulRichText } from "./ContentfulRichText";
import { Icon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

interface PageBannerProps {
  heading: string;
  subheading?: string;
  svg?: ReactElement;
  image?: string;
  message?: RichTextProps;
  breadCrumbs?: {
    text: string;
    href?: string;
  }[];
}
export const PageBanner = ({
  heading,
  svg,
  message,
  image,
  breadCrumbs,
  subheading,
}: PageBannerProps) => {
  const isLoading = heading === "undefined" ? true : false;

  return (
    <section className="page-banner">
      <div>
        <div className="copy">
          {breadCrumbs && (
            <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
              <ol className="usa-breadcrumb__list">
                {breadCrumbs.map((crumb, index: number) => {
                  const isCurrent = breadCrumbs.length - 1 === index;
                  return (
                    <li
                      className={`usa-breadcrumb__list-item${isCurrent ? " usa-current" : ""}`}
                      aria-current={isCurrent ? "page" : undefined}
                      key={crumb.text + index}
                    >
                      {crumb.href ? (
                        <a className="usa-breadcrumb__link" href={crumb.href}>
                          {crumb.text}
                        </a>
                      ) : (
                        <span>{crumb.text}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
          {!isLoading && (
            <h1>
              <span>{heading}</span>
              {svg && !image && svg}
              {image && !svg && <img src={image} alt={`Icon for ${heading}`} />}
            </h1>
          )}
          {subheading && <p>{subheading}</p>}
          {message && (
            <>
              <ContentfulRichText document={message.json} />
            </>
          )}
        </div>
        <div className="icon">
          {svg && !image && !isLoading && svg}
          {image && !svg && !isLoading && <img src={image} alt={`Icon for ${heading}`} />}
        </div>
      </div>
    </section>
  );
};
