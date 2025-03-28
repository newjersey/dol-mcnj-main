import { LinkProps } from "@utils/types";
import { InfoBlocks } from "../PageBanner/InfoBlocks";
import { toUsCurrency } from "@utils/toUsCurrency";
import { TitleBox } from "./TitleBox";
import { CrumbSearch } from "./CrumbSearch";

interface OccupationBannerProps {
  id: string;
  name: string;
  provider?: string;
  printHandler: () => void;
  breadcrumbsCollection?: { items: LinkProps[] };
  inDemand?: boolean;
  employmentRate?: number;
  salary?: number;
}

export const OccupationBanner = (props: OccupationBannerProps) => {
  return (
    <>
      <CrumbSearch
        className="occupationBanner"
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
            costBlock={{
              copy: "Jobs Open in NJ",
              number: props.salary ? props.salary : "Not available",
              definition:
                "Job openings are based on postings from the NLx job board and reflect positions in New Jersey. The actual number of available jobs may vary.",
            }}
            rateBlock={{
              copy: "Median Salary",
              number: props.employmentRate
                ? toUsCurrency(props.employmentRate)
                : "Not available",
              definition:
                "On average, workers in this occupation earn this amount in the State of NJ.. Data source: NJ Dept of Labor",
            }}
          />
        </div>
      </div>
    </>
  );
};
