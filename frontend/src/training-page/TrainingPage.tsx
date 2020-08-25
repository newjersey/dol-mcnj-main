import React, { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Training } from "../domain/Training";
import { Header } from "../search-results/Header";
import { CalendarLengthLookup } from "../localizations/CalendarLengthLookup";
import { InlineIcon } from "../components/InlineIcon";
import { BetaBanner } from "../components/BetaBanner";
import { InDemandTag } from "../components/InDemandTag";
import { LocalWaiverTag } from "../components/LocalWaiverTag";
import { Error } from "../domain/Error";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { NotFoundPage } from "../error/NotFoundPage";
import { Grouping } from "./Grouping";
import { formatMoney } from "accounting";
import { formatPercentEmployed } from "../presenters/formatPercentEmployed";
import { Icon, useMediaQuery } from "@material-ui/core";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import ReactTooltip from "react-tooltip";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const TrainingPage = (props: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const [training, setTraining] = useState<Training | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const idToFetch = props.id ? props.id : "";
    props.client.getTrainingById(idToFetch, {
      onSuccess: setTraining,
      onError: (error: Error) => setError(error),
    });
  }, [props.id, props.client]);

  const getHttpUrl = (url: string): string => {
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      return "http://" + url;
    }

    return url;
  };

  const getProviderUrl = (): ReactElement => {
    if (!training?.provider?.url) {
      return <>--</>;
    }

    return (
      <a target="_blank" rel="noopener noreferrer" href={getHttpUrl(training.provider.url)}>
        {training.provider.url}
      </a>
    );
  };

  const getCareerTrackList = (): string => {
    if (!training || training.occupations.length === 0) {
      return "--";
    }

    return training.occupations.join(", ");
  };

  const getProviderAddress = (): ReactElement => {
    if (training?.online) {
      return <>Online Class</>;
    }

    if (!training || !training.provider.address.city) {
      return <>--</>;
    }

    const address = training.provider.address;

    return (
      <div className="inline">
        <span>{address.street1}</span>
        <div>{address.street2}</div>
        <div>
          {address.city}, {address.state} {address.zipCode}
        </div>
      </div>
    );
  };

  const getProviderContact = (): ReactElement => {
    if (!training) {
      return <></>;
    }

    let phoneNumber = parsePhoneNumberFromString(
      training.provider.phoneNumber,
      "US"
    )?.formatNational();
    if (training.provider.phoneExtension) {
      phoneNumber = `${phoneNumber} Ext: ${training.provider.phoneExtension}`;
    }

    return (
      <div className="inline">
        <span>{training.provider.contactName}</span>
        <div>{training.provider.contactTitle}</div>
        <div>{phoneNumber}</div>
      </div>
    );
  };

  const getDataMissingOrSource = (data: number | null): ReactElement | undefined => {
    if (!data) {
      return (
        <div>
          * This information is missing because we haven’t received enough data from this institute.
        </div>
      );
    } else {
      return <div>Data source: NJ Dept of Labor</div>;
    }
  };

  if (training) {
    return (
      <>
        <Header />
        <BetaBanner />
        <main className="container below-banners" role="main">
          <h2 className="text-xl ptm pbs weight-500">{training.name}</h2>
          {training.inDemand ? <InDemandTag /> : <></>}
          {training.localExceptionCounty.map((county) => (
            <LocalWaiverTag key={county} county={county} />
          ))}

          <div className="fdr">
            <div className="bg-lightest-purple stat-block mtm">
              <div className="fdr">
                <div>Avg. Salary</div>
                <div className="mla">
                  <Icon fontSize="small" data-for="average-salary-tooltip" data-tip="">
                    info
                  </Icon>
                  <ReactTooltip
                    id="average-salary-tooltip"
                    className="tooltip"
                    border={true}
                    borderColor={"#dbdada"}
                    effect="solid"
                    place="bottom"
                    type="light"
                  >
                    <div className="pbs">
                      Average salary 6 months after completion of this class or classes like it at
                      this provider
                    </div>
                    {getDataMissingOrSource(training.averageSalary)}
                  </ReactTooltip>
                </div>
              </div>
              <div className="stat-block-number ptm">
                {training.averageSalary
                  ? formatMoney(training.averageSalary, { precision: 0 })
                  : "--"}
              </div>
            </div>
            <div className="bg-lighter-purple stat-block mtm">
              <div className="fdr">
                <div>{isTabletAndUp ? "Employment Rate" : "Employ. Rate"}</div>
                <div className="mla">
                  <Icon fontSize="small" data-for="employment-rate-tooltip" data-tip="">
                    info
                  </Icon>
                  <ReactTooltip
                    id="employment-rate-tooltip"
                    className="tooltip"
                    border={true}
                    borderColor={"#dbdada"}
                    effect="solid"
                    place="bottom"
                    type="light"
                  >
                    <div className="pbs">
                      Percentage of enrolled students who were employed within 6 months of finishing
                      this class or classes like it at this provider
                    </div>
                    {getDataMissingOrSource(training.percentEmployed)}
                  </ReactTooltip>
                </div>
              </div>
              <div className="stat-block-number">
                {training.percentEmployed ? formatPercentEmployed(training.percentEmployed) : "--"}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="container-fluid">
                <div className="row">
                  <Grouping title="Description">
                    <p>{training.description}</p>
                  </Grouping>

                  <Grouping title="Quick Stats">
                    <>
                      <p>
                        <span className="fin">
                          <InlineIcon className="mrxs">work_outline</InlineIcon>
                          Career Track: {getCareerTrackList()}
                        </span>
                      </p>
                      <p>
                        <span className="fin">
                          <InlineIcon className="mrxs">av_timer</InlineIcon>
                          {CalendarLengthLookup[training.calendarLength]}
                        </span>
                      </p>
                    </>
                  </Grouping>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="container-fluid">
                <div className="row">
                  <Grouping title="Cost">
                    <p>
                      <span className="weight-500">Total Cost</span>
                      <span className="text-l pull-right weight-500">
                        {formatMoney(training.totalCost)}
                      </span>
                    </p>
                  </Grouping>

                  <Grouping title="Provider Details">
                    <>
                      <p>
                        <span className="fin fas">
                          <InlineIcon className="mrxs">school</InlineIcon>
                          {training.provider.name}
                        </span>
                      </p>
                      <div className="mvd">
                        <span className="fin">
                          <InlineIcon className="mrxs">location_on</InlineIcon>
                          {getProviderAddress()}
                        </span>
                      </div>
                      <div className="mvd">
                        <span className="fin">
                          <InlineIcon className="mrxs">person</InlineIcon>
                          {getProviderContact()}
                        </span>
                      </div>
                      <p>
                        <span className="fin">
                          <InlineIcon className="mrxs">link</InlineIcon>
                          {getProviderUrl()}
                        </span>
                      </p>
                    </>
                  </Grouping>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  } else if (error === Error.SYSTEM_ERROR) {
    return <SomethingWentWrongPage />;
  } else if (error === Error.NOT_FOUND) {
    return <NotFoundPage />;
  } else {
    return <></>;
  }
};
