import { LinkProps } from "@utils/types";
import { ProgramOutcome } from "@utils/types/components";
import { InfoBlocks } from "../PageBanner/InfoBlocks";
import { OutcomeDetails } from "@components/modules/OutcomeDetails";
import { CrumbSearch } from "./CrumbSearch";
import { TitleBox } from "./TitleBox";
import { hasOutcomeData } from "@utils/outcomeHelpers";

interface ProgramBannerProps {
  id: string;
  name: string;
  provider?: string;
  printHandler: () => void;
  breadcrumbsCollection?: { items: LinkProps[] };
  inDemand?: boolean;
  outcomes?: ProgramOutcome;
}

export const ProgramBanner = (props: ProgramBannerProps) => {
  // Always show outcomes component - it will handle "Data unreported" internally
  const showOutcomes = true;
  const hasData = hasOutcomeData(props.outcomes);
  
  return (
    <>
      <CrumbSearch
        className="programBanner"
        items={props.breadcrumbsCollection?.items || []}
        name={props.name}
      />
      <TitleBox
        id={props.id}
        name={props.name}
        provider={props.provider || ""}
        printHandler={props.printHandler}
      />
      <div className="programBanner">
        <div className="container blocksContainer">
          {/* Mobile: Only show InfoBlocks, OutcomeDetails handled by tab interface */}
          <div className="tabletMd:hidden">
            <InfoBlocks
              titleBlock={
                props.inDemand
                  ? {
                      copy: "In-Demand in New Jersey",
                      message:
                        "This training may be eligible for funding from your",
                      link: {
                        url: "https://www.nj.gov/labor/career-services/contact-us/one-stops/",
                        copy: "One-Stop Career Center.",
                      },
                    }
                  : undefined
              }
            />
          </div>
          
          {/* Tablet and Desktop: Stacked when has data, horizontal when no data */}
          <div className="hidden tabletMd:block">
            {hasData ? (
              // When there's data, stack vertically
              <div className="space-y-6">
                <div className="w-full tabletMd:w-1/2 [&_.infoBlocks_.box.title]:!max-w-full">
                  <InfoBlocks
                    titleBlock={
                      props.inDemand
                        ? {
                            copy: "In-Demand in New Jersey",
                            message:
                              "This training may be eligible for funding from your",
                            link: {
                              url: "https://www.nj.gov/labor/career-services/contact-us/one-stops/",
                              copy: "One-Stop Career Center.",
                            },
                          }
                        : undefined
                    }
                  />
                </div>
                
                {showOutcomes && (
                  <OutcomeDetails 
                    outcomes={props.outcomes!} 
                    horizontal={true}
                    className="mb-0"
                  />
                )}
              </div>
            ) : (
              // When there's no data, display side by side
              <div className="flex flex-wrap gap-4 items-start">
                <div className="flex-shrink-0">
                  <InfoBlocks
                    titleBlock={
                      props.inDemand
                        ? {
                            copy: "In-Demand in New Jersey",
                            message:
                              "This training may be eligible for funding from your",
                            link: {
                              url: "https://www.nj.gov/labor/career-services/contact-us/one-stops/",
                              copy: "One-Stop Career Center.",
                            },
                          }
                        : undefined
                    }
                  />
                </div>
                
                {showOutcomes && (
                  <div className="flex-1 min-w-0">
                    <OutcomeDetails 
                      outcomes={props.outcomes!} 
                      horizontal={true}
                      className="mb-0"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
