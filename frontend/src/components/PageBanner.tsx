import { Fragment, ReactElement } from "react";
import { RightArrow } from "../svg/RightArrow";
import { ContentfulRichText as RichTextProps } from "../types/contentful";
import { ContentfulRichText } from "./ContentfulRichText";
import { Icon } from "@material-ui/core";

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
  return (
    <section className="page-banner">
      <div>
        <div className="copy">
          {breadCrumbs && (
            <>
              <ul className="breadcrumbs unstyled">
                {breadCrumbs.map((crumb, index: number) => (
                  <Fragment key={crumb.text + index}>
                    {index > 0 && <RightArrow />}
                    <li>{crumb.href ? <a href={crumb.href}>{crumb.text}</a> : crumb.text}</li>
                  </Fragment>
                ))}
              </ul>
              <a className="back" href={breadCrumbs[0].href}>
                <Icon>arrow_back</Icon>
                {breadCrumbs[breadCrumbs.length - 1].text}
              </a>
            </>
          )}
          <h1>{heading}</h1>
          <div className="icon">
            {subheading && <p>{subheading}</p>}
            {message && (
              <>
                <ContentfulRichText document={message.json} />
              </>
            )}
          </div>
        </div>
        {svg}
        {image && <img src={image} alt={`Icon for ${heading}`} />}
      </div>
    </section>
  );
};
