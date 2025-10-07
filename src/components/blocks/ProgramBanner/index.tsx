import { LinkProps } from "@utils/types";
import { ProgramOutcome } from "@utils/types/components";
import { InfoBlocks } from "../PageBanner/InfoBlocks";
import { OutcomeDetails } from "@components/modules/OutcomeDetails";
import { CrumbSearch } from "./CrumbSearch";
import { TitleBox } from "./TitleBox";

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
          
          {/* Tablet and Desktop: Always stacked */}
          <div className="hidden tabletMd:block">
            <div className="space-y-6">
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
              
              {showOutcomes && (
                <OutcomeDetails 
                  outcomes={props.outcomes!} 
                  horizontal={true}
                  className="mb-0"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
