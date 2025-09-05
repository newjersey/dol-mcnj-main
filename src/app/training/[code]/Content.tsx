"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { TrainingProps } from "@utils/types";
import { Button } from "@components/modules/Button";
import { ProgramBanner } from "@components/blocks/ProgramBanner";
import { OutcomeDetails } from "@components/modules/OutcomeDetails";
import { hasOutcomeData } from "@utils/outcomeHelpers";
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
  const [activeTab, setActiveTab] = useState<"details" | "crc">("details");
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
      />

      <section className="body-copy">
        <div className="container">
          {/* Mobile View: Tabs */}
          <div className="tabletMd:hidden">
            {hasOutcomeData(training.outcomes) ? (
              <>
                <div className="bg-primaryLighter rounded-lg p-1 mb-6">
                  <nav className="flex justify-around">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`py-2.5 text-base font-medium leading-5 border-b-4 w-full ${
                        activeTab === "details"
                          ? "text-primary border-primary"
                          : "text-gray-600 border-transparent hover:text-gray-800"
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setActiveTab("crc")}
                      className={`py-2.5 text-base font-medium leading-5 border-b-4 w-full ${
                        activeTab === "crc"
                          ? "text-primary border-primary"
                          : "text-gray-600 border-transparent hover:text-gray-800"
                      }`}
                    >
                      Consumer report card
                    </button>
                  </nav>
                </div>

                {activeTab === "details" && (
                  <div className="inner">
                    <div>
                      <Description training={training} />
                      <QuickFacts training={training} />
                      <Cost training={training} />
                      <LocationContactDetails training={training} />
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
                      <SupportServices training={training} />
                      <HowToGetFunding />
                      <Button
                        type="link"
                        highlight="orange"
                        label="See something wrong? Report an issue."
                        link={`/contact?path=/training/${training.id}&title=${training.name}`}
                        newTab
                        iconPrefix="Flag"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "crc" && <OutcomeDetails outcomes={training.outcomes} />}
              </>
            ) : (
              <div className="inner">
                <div>
                  <Description training={training} />
                  <QuickFacts training={training} />
                  <Cost training={training} />
                  <LocationContactDetails training={training} />
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
                  <SupportServices training={training} />
                  <HowToGetFunding />
                  <Button
                    type="link"
                    highlight="orange"
                    label="See something wrong? Report an issue."
                    link={`/contact?path=/training/${training.id}&title=${training.name}`}
                    newTab
                    iconPrefix="Flag"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop View: No Tabs */}
          <div className="hidden tabletMd:block">
            {hasOutcomeData(training.outcomes) && <OutcomeDetails outcomes={training.outcomes} />}
            <div className="inner mt-6">
              <div>
                <Description training={training} />
                <QuickFacts training={training} />
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
                <HowToGetFunding />
              </div>
              <div>
                <Cost training={training} />
                <LocationContactDetails training={training} />
                <SupportServices training={training} />
                <Button
                  type="link"
                  highlight="orange"
                  label="See something wrong? Report an issue."
                  link={`/contact?path=/training/${training.id}&title=${training.name}`}
                  newTab
                  iconPrefix="Flag"
                />
              </div>
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
