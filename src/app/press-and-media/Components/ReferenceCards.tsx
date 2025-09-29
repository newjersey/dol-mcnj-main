"use client";
import { MediaCard, MediaCardProps } from "@components/modules/MediaCard";
import { SectionHeading } from "@components/modules/SectionHeading";
import { useEffect, useState } from "react";

const cardRowClasses =
  "grid grid-cols-1 tablet:grid-cols-2 items-start tabletLg:grid-cols-3 gap-8";

export const ReferenceCards = ({
  heading,
  description,
  logoCard,
  colorCard,
}: {
  heading: string;
  description: string;
  logoCard: MediaCardProps;
  colorCard: MediaCardProps;
}) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    if (copySuccess) {
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  }, [copySuccess]);

  return (
    <section className="container">
      <SectionHeading
        withIds
        heading={heading}
        description={description}
        noDivider
      />
      <div className={cardRowClasses}>
        <MediaCard
          title={logoCard.title}
          description={logoCard.description}
          button={{
            label: "Download logos",
            type: "link",
            link: "/Logos.zip",
            iconSuffix: "DownloadSimple",
          }}
        />
        <MediaCard
          title={colorCard.title}
          description={colorCard.description}
          button={{
            label: "Copy colors",
            type: "button",
            defaultStyle: copySuccess ? "secondary" : "primary",
            iconSuffix: copySuccess ? "Check" : "Copy",
            onClick: () => {
              if (colorCard.description) {
                const textToCopy = colorCard.description.replace(
                  /<[^>]+>/g,
                  ""
                );
                navigator.clipboard.writeText(textToCopy);
                setCopySuccess(true);
              }
            },
          }}
        />
      </div>
    </section>
  );
};
