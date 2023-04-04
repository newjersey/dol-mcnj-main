import { Fragment, ReactElement } from "react";
import { RightArrow } from "../svg/RightArrow";
import { ContentfulRichText as RichTextProps } from "../types/contentful";
import { ContentfulRichText } from "./ContentfulRichText";

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
          <ul>
            {breadCrumbs?.map((crumb, index: number) => (
              <Fragment key={crumb.text + index}>
                {index > 0 && <RightArrow />}
                <li>{crumb.href ? <a href={crumb.href}>{crumb.text}</a> : crumb.text}</li>
              </Fragment>
            ))}
          </ul>
          <h1>{heading}</h1>
          {subheading && <p>{subheading}</p>}
          {message && (
            <>
              <ContentfulRichText document={message.json} />
            </>
          )}
        </div>
        {svg}
        {image && <img src={image} alt={`Icon for ${heading}`} />}
      </div>
    </section>
  );
};
