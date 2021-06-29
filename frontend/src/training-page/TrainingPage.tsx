import React, { ReactElement, useEffect, useState, useRef } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Training } from "../domain/Training";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CalendarLengthLookup } from "../localizations/CalendarLengthLookup";
import { InlineIcon } from "../components/InlineIcon";
import { BetaBanner } from "../components/BetaBanner";
import { InDemandTag } from "../components/InDemandTag";
import { Error } from "../domain/Error";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { NotFoundPage } from "../error/NotFoundPage";
import { Grouping } from "../components/Grouping";
import { formatMoney } from "accounting";
import { formatPercentEmployed } from "../presenters/formatPercentEmployed";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { StatBlock } from "../components/StatBlock";
import { Icon } from "@material-ui/core";
import { Button } from "../components/Button";
import { useReactToPrint } from "react-to-print";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

interface Copy {
  class: string;
  text: string;
}

export const TrainingPage = (props: Props): ReactElement => {
  const [training, setTraining] = useState<Training | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [copy, setCopy] = useState<Copy | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (training) {
      document.title = `${training.name}`;
    }
  }, [training]);

  useEffect(() => {
    const idToFetch = props.id ? props.id : "";
    props.client.getTrainingById(idToFetch, {
      onSuccess: (result: Training) => {
        setError(null);
        setTraining(result);
      },
      onError: (error: Error) => setError(error),
    });
  }, [props.id, props.client]);

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const copyHandler = (): void => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      setCopy({
        class: "red",
        text: "Unsuccessful, try  again later",
      });
    }

    setCopy({
      class: "green",
      text: "Successfully copied",
    });

    setTimeout((): void => {
      setCopy(null);
    }, 5000);
  };

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
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="break-text"
        href={getHttpUrl(training.provider.url)}
      >
        {training.provider.url}
      </a>
    );
  };

  const getProviderAddress = (): ReactElement => {
    if (training?.online) {
      return <>Online Class</>;
    }

    if (!training || !training.provider.address.city) {
      return <>--</>;
    }

    const address = training.provider.address;
    const nameAndAddressEncoded = encodeURIComponent(
      `${training.provider.name} ${address.street1} ${address.street2} ${address.city} ${address.state} ${address.zipCode}`
    );
    const googleUrl = `https://www.google.com/maps/search/?api=1&query=${nameAndAddressEncoded}`;

    return (
      <a href={googleUrl} target="_blank" rel="noopener noreferrer">
        <div className="inline">
          <span>{address.street1}</span>
          <div>{address.street2}</div>
          <div>
            {address.city}, {address.state} {address.zipCode}
          </div>
        </div>
      </a>
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

  const getAssociatedOccupations = (): ReactElement => {
    if (
      training?.occupations.length === 0 ||
      training?.occupations.map((it) => it.title).includes("NO MATCH")
    ) {
      return (
        <p>
          This is a general training that might prepare you for a wide variety of career paths.
          Browse&nbsp;
          <Link className="link-format-blue" to="/in-demand-occupations">
            in-demand occupations
          </Link>
          &nbsp;to see how you might apply this training.
        </p>
      );
    }

    return (
      <>
        {training?.occupations.map((occupation, i) => (
          <Link className="no-link-format" to={`/occupation/${occupation.soc}`} key={i}>
            <p key={i} className="blue weight-500">
              {occupation.title}
            </p>
          </Link>
        ))}
      </>
    );
  };

  if (training) {
    return (
      <>
        <div ref={componentRef}>
          <Header />
          <BetaBanner />
          <main className="container below-banners" role="main">
            <div className="ptm weight-500 fin all-caps border-bottom-dark">
              Training Opportunity
            </div>
            <h2 className="text-xl ptd pbs weight-500">{training.name}</h2>
            <h3 className="text-l pbs weight-500">{training.provider.name}</h3>
            {training.inDemand ? <InDemandTag className="mts" /> : <></>}

            <div className="stat-block-stack mtm">
              <StatBlock
                title="Avg Salary after Program"
                tooltipText="Average salary 6 months after completion of this class or classes like it at
                      this provider"
                data={
                  training.averageSalary
                    ? formatMoney(training.averageSalary, { precision: 0 })
                    : "--"
                }
                backgroundColorClass="bg-lightest-purple"
              />
              <StatBlock
                title="Program Employment Rate"
                tooltipText="Percentage of enrolled students employed within 6 months of this class or
                      classes like it at this provider"
                data={
                  training.percentEmployed ? formatPercentEmployed(training.percentEmployed) : "--"
                }
                backgroundColorClass="bg-lighter-purple"
              />
            </div>

            <div className="row pbm">
              <div className="col-md-8">
                <div className="container-fluid">
                  <div className="row">
                    <Grouping title="Description">
                      <>
                        {training.description.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </>
                    </Grouping>

                    <Grouping title="Quick Stats">
                      <>
                        {training.certifications && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">school</InlineIcon>
                              Certifications: {training.certifications}
                            </span>
                          </p>
                        )}
                        {training.prerequisites && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">list_alt</InlineIcon>
                              Prerequisites: {training.prerequisites}
                            </span>
                          </p>
                        )}
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">av_timer</InlineIcon>
                            Completion time: {CalendarLengthLookup[training.calendarLength]}
                          </span>
                        </p>
                      </>
                    </Grouping>

                    <Grouping title="Associated Occupations">
                      <>{getAssociatedOccupations()}</>
                    </Grouping>

                    <Grouping title="Share this Training">
                      <>
                        {training.inDemand && (
                          <p className="mvd" data-testid="shareInDemandTraining">
                            This training leads to an occupation that is in-demand, which may
                            qualify for funding. Contact your NJ County One-Stop Career, who will
                            help determine funding eligibility, and share this training page with
                            them.
                          </p>
                        )}
                        <p>
                          <Button className="link-format-blue" onClick={copyHandler}>
                            <Icon className="accessible-gray weight-500">link</Icon>
                            <span className="mlxs weight-500">
                              Copy a link to this training opportunity {">"}
                            </span>
                          </Button>
                          {copy && (
                            <span className={`text-s weight-500 mls ${copy?.class}`}>
                              {copy?.text}
                            </span>
                          )}
                        </p>
                        <p>
                          <Button className="link-format-blue" onClick={printHandler}>
                            <Icon className="accessible-gray weight-500">print</Icon>
                            <span className="mlxs weight-500">
                              Save and print this training opportunity {">"}
                            </span>
                          </Button>
                        </p>
                        <p>
                          <Link className="no-link-format weight-500 fin" to="/funding">
                            <Icon className="accessible-gray">attach_money</Icon>
                            <span className="blue">
                              Learn more about funding options and One-Stop Centers {">"}
                            </span>
                          </Link>
                        </p>
                      </>
                    </Grouping>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="container-fluid mbm">
                  <div className="row">
                    <Grouping title="Cost">
                      <>
                        <p>
                          <span className="weight-500">Total Cost</span>
                          <span className="text-l pull-right weight-500">
                            {formatMoney(training.totalCost)}
                          </span>
                        </p>
                        <div className="grey-line" />
                        <div className="mvd">
                          <div>
                            <span>Tution</span>
                            <span className="pull-right">{formatMoney(training.tuitionCost)}</span>
                          </div>
                          <div>
                            <span>Fees</span>
                            <span className="pull-right">{formatMoney(training.feesCost)}</span>
                          </div>
                          <div>
                            <span>Books & Materials</span>
                            <span className="pull-right">
                              {formatMoney(training.booksMaterialsCost)}
                            </span>
                          </div>
                          <div>
                            <span>Supplies & Tools</span>
                            <span className="pull-right">
                              {formatMoney(training.suppliesToolsCost)}
                            </span>
                          </div>
                          <div>
                            <span>Other</span>
                            <span className="pull-right">{formatMoney(training.otherCost)}</span>
                          </div>
                        </div>
                      </>
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
          <Footer />
        </div>
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
