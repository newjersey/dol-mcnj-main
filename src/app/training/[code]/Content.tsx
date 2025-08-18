"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { TrainingProps } from "@utils/types";
import { Button } from "@components/modules/Button";
import { ProgramBanner } from "@components/blocks/ProgramBanner";
import { AssociatedOccupationsIndustries } from "./sections/AssociatedOccupationsIndustries";
import { Cost } from "./sections/Cost";
import { Description } from "./sections/Description";
import { HowToGetFunding } from "./sections/HowToGetFunding";
import { InstructionalPrograms } from "./sections/InstructionalPrograms";
import { LocationContactDetails } from "./sections/LocationContactDetails";
import { QuickFacts } from "./sections/QuickFacts";
import { SupportServices } from "./sections/SupportServices";
import { CipDrawer } from "./CipDrawer";
import { SocDrawer } from "./SocDrawer";
import { generateJsonLd } from "./jsonLd";
import { createPortal } from "react-dom";

const Content = ({ training }: { training: TrainingProps }) => {
  const [cipDrawerOpen, setCipDrawerOpen] = useState(false);
  const [socDrawerOpen, setSocDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div ref={contentRef}>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd(training)),
        }}
      />
      <ProgramBanner
        name={training.name}
        id={training.id}
        provider={training.provider.name}
        printHandler={reactToPrintFn}
        breadcrumbsCollection={{
          items: [
            {
              copy: "Home",
              url: "/",
            },
            {
              copy: "Training Explorer",
              url: "/training",
            },
            {
              copy: "Search",
              url: "/training/search",
            },
          ],
        }}
        inDemand={training.inDemand}
        employmentRate={training.percentEmployed}
        salary={training.averageSalary}
      />

      <section className="body-copy">
        <div className="container">
          <div className="inner">
            <div>
              <Description training={training} />
              <QuickFacts training={training} />
              <Cost training={training} mobileOnly />
              <LocationContactDetails training={training} mobileOnly />
              <InstructionalPrograms
                training={training}
                setCipDrawerOpen={setCipDrawerOpen}
                cipDrawerOpen={cipDrawerOpen}
              />
              <AssociatedOccupationsIndustries
                training={training}
                setSocDrawerOpen={setSocDrawerOpen}
                socDrawerOpen={socDrawerOpen}
              />
              <HowToGetFunding desktopOnly />
            </div>
            <div>
              <Cost training={training} desktopOnly />
              <LocationContactDetails training={training} desktopOnly />
              <SupportServices training={training} />
              <HowToGetFunding mobileOnly />
              <Button
                type="button"
                highlight="orange"
                label="See something wrong? Report an issue."
                onClick={() => {
                  // reload current page with `?path=/training/${training.id}&title=${training.name}`
                  window.location.href = `?contactModal=true&path=/training/${training.id}&title=${training.name}`;
                }}
                newTab
                iconPrefix="Flag"
              />
            </div>
          </div>
        </div>
      </section>

      {mounted &&
        createPortal(
          <CipDrawer
            cipDrawerOpen={cipDrawerOpen}
            setCipDrawerOpen={setCipDrawerOpen}
          />,
          document.body
        )}
      {mounted &&
        createPortal(
          <SocDrawer
            socDrawerOpen={socDrawerOpen}
            setSocDrawerOpen={setSocDrawerOpen}
          />,
          document.body
        )}
    </div>
  );
};

export { Content };
