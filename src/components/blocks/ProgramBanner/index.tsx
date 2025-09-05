import { LinkProps } from "@utils/types";
import { InfoBlocks } from "../PageBanner/InfoBlocks";
import { CrumbSearch } from "./CrumbSearch";
import { TitleBox } from "./TitleBox";

interface ProgramBannerProps {
  id: string;
  name: string;
  provider?: string;
  printHandler: () => void;
  breadcrumbsCollection?: { items: LinkProps[] };
  inDemand?: boolean;
}

export const ProgramBanner = (props: ProgramBannerProps) => {
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
      </div>
    </>
  );
};
