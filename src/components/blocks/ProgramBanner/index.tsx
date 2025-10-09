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
          
          {/* Tablet: Stack vertically with in-demand taking 1/2 width */}
          <div className="hidden tabletMd:block desktop:hidden">
            <div className="space-y-6">
              {props.inDemand && (
                <div className="!w-1/2 !max-w-1/2">
                  <InfoBlocks
                    className="[&>div]:!w-full [&_.box.title]:!max-w-full"
                    titleBlock={{
                      copy: "In-Demand in New Jersey",
                      message:
                        "This training may be eligible for funding from your",
                      link: {
                        url: "https://www.nj.gov/labor/career-services/contact-us/one-stops/",
                        copy: "One-Stop Career Center.",
                      },
                    }}
                  />
                </div>
              )}
              
              {showOutcomes && (
                <OutcomeDetails 
                  outcomes={props.outcomes!} 
                  horizontal={true}
                  className="mb-0 w-full"
                />
              )}
            </div>
          </div>

          {/* Desktop: Display side by side with in-demand block having min width */}
          <div className="hidden desktop:block">
            <div className="flex flex-wrap gap-4 items-start">
              {props.inDemand && (
                <div className="flex-shrink-0 min-w-[300px]">
                  <InfoBlocks
                    titleBlock={{
                      copy: "In-Demand in New Jersey",
                      message:
                        "This training may be eligible for funding from your",
                      link: {
                        url: "https://www.nj.gov/labor/career-services/contact-us/one-stops/",
                        copy: "One-Stop Career Center.",
                      },
                    }}
                  />
                </div>
              )}
              
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
          </div>
        </div>
      </div>
    </>
  );
};
