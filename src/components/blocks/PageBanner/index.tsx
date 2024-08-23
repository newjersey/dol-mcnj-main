"use client";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { ContentfulRichText } from "@components/modules/ContentfulRichText";
import { Cta } from "@components/modules/Cta";
import { Heading } from "@components/modules/Heading";
import { createButtonObject } from "@utils/createButtonObject";
import { PageBannerProps } from "@utils/types";
import { Highlights } from "./Highlights";
import { InfoBlocks } from "./InfoBlocks";
import { Tag } from "@components/modules/Tag";
import { useRef } from "react";

const PageBanner = ({
  breadcrumbsCollection,
  className,
  ctaHeading,
  ctaLinks,
  eyebrow,
  finalCrumb,
  highlightsCollection,
  inDemand,
  infoBlocks,
  message,
  saveButtons,
  subHeading,
  theme,
  title,
}: PageBannerProps) => {
  const ctaLinkButtons = ctaLinks?.map((link) => {
    return createButtonObject(link);
  });

  const componentRef = useRef<HTMLDivElement>(null);

  const ctaMode = ctaLinkButtons && !highlightsCollection && !infoBlocks;
  const highlightMode = highlightsCollection && !ctaLinkButtons && !infoBlocks;
  const infoMode = infoBlocks && !highlightsCollection && !ctaLinkButtons;

  return (
    <section
      ref={componentRef}
      className={`pageBanner${className ? ` ${className}` : ""}${
        theme ? ` theme-${theme}` : ""
      }${highlightMode ? ` data` : ""}${infoMode ? ` info` : ""}${
        breadcrumbsCollection?.items ? "" : " noBreadcrumbs"
      }`}
    >
      <div className="container">
        {breadcrumbsCollection?.items && (
          <Breadcrumbs
            pageTitle={finalCrumb || title}
            crumbs={breadcrumbsCollection.items}
          />
        )}
        <div className="copy">
          <div className="heading">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <Heading level={1}>{title}</Heading>
            {inDemand && (
              <Tag
                chip
                icon="Fire"
                iconWeight="fill"
                title="In-Demand"
                color="orange"
              />
            )}
            {message && <ContentfulRichText document={message.json} />}
            {subHeading && (
              <Heading level={2} className="subHeading">
                {subHeading}
              </Heading>
            )}
          </div>

          {ctaMode && ctaLinks && ctaLinks.length > 0 && (
            <Cta heading={ctaHeading} links={ctaLinkButtons} theme={theme} />
          )}
          {saveButtons && (
            <div className="save-buttons desktop-only">{saveButtons}</div>
          )}
          {highlightMode && <Highlights items={highlightsCollection.items} />}
        </div>
        {infoMode && <InfoBlocks {...infoBlocks} />}
        {saveButtons && (
          <div className="save-buttons mobile-only">{saveButtons}</div>
        )}
      </div>
    </section>
  );
};

export { PageBanner };
