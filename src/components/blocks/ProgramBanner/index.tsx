import { LinkProps } from "@utils/types";
import { InfoBlocks } from "../PageBanner/InfoBlocks";
import { formatPercentEmployed } from "@utils/formatPercentEmployed";
import { toUsCurrency } from "@utils/toUsCurrency";
import { CrumbSearch } from "./CrumbSearch";
import { TitleBox } from "./TitleBox";

interface ProgramBannerProps {
  id: string;
  name: string;
  provider?: string;
  printHandler: () => void;
  breadcrumbsCollection?: { items: LinkProps[] };
  inDemand?: boolean;
  employmentRate?: number;
  salary?: number;
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
            costBlock={{
              copy: "Avg Salary after Program",
              number: props.salary
                ? toUsCurrency(props.salary)
                : "Not available",
              definition:
                "Average salary 6 months after completion of this class or classes like it at this provider. * This information is missing because we haven't received enough data from this institute.",
            }}
            rateBlock={{
              copy: "Program Employment Rate",
              number: props.employmentRate
                ? formatPercentEmployed(props.employmentRate)
                : "Not available",
              definition:
                "Percentage of enrolled students employed within 6 months of this class or classes like it at this provider. * This information is missing because we haven't received enough data from this institute.",
            }}
          />
        </div>
      </div>
    </>
  );
};
