"use client";
import { PageBanner } from "@components/blocks/PageBanner";
import { Button } from "@components/modules/Button";
import { CostTable } from "@components/modules/CostTable";
import { Drawer } from "@components/modules/Drawer";
import { Heading } from "@components/modules/Heading";
import { IconSelector } from "@components/modules/IconSelector";
import { LabelBox } from "@components/modules/LabelBox";
import { LinkObject } from "@components/modules/LinkObject";
import { Flex } from "@components/utility/Flex";
import { Tooltip } from "@components/utility/Tooltip";
import {
  Baby,
  BookBookmark,
  Briefcase,
  CalendarBlank,
  Clock,
  Globe,
  GraduationCap,
  Info,
  LinkSimpleHorizontal,
  ListBullets,
  MapPin,
  Moon,
  User,
  WheelchairMotion,
} from "@phosphor-icons/react";
import { logEvent } from "@utils/analytics";
import { calendarLength } from "@utils/calendarLength";
import { formatCip } from "@utils/formatCip";
import { formatPercentEmployed } from "@utils/formatPercentEmployed";
import { formatPhoneNumber } from "@utils/formatPhoneNumber";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { toUsCurrency } from "@utils/toUsCurrency";
import { TrainingProps } from "@utils/types";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface Copy {
  class: string;
  text: string;
}

const Content = ({ training }: { training: TrainingProps }) => {
  const desc = parseMarkdownToHTML(training.description);
  const [copied, setCopied] = useState(false);
  const [cipDrawerOpen, setCipDrawerOpen] = useState(false);

  const componentRef = useRef<HTMLDivElement>(null);

  const printReactContent = useReactToPrint({
    pageStyle: "@page { size: auto;  margin: 20mm; }",
    documentTitle: "Training Content",
  });

  const [copy, setCopy] = useState<Copy | null>(null);

  const printHandler = (): void => {
    printReactContent();
    logEvent("Training page", "Clicked print link", training.id);
  };

  const copyHandler = (): void => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      setCopy({
        class: "red",
        text: "Unsuccessful, try again later",
      });
    }

    setCopy({
      class: "green",
      text: "Successfully copied",
    });

    setTimeout((): void => {
      setCopy(null);
    }, 5000);

    logEvent("Training page", "Clicked copy link", training.id);
  };

  const generateJsonLd = (training: TrainingProps) => {
    const audience = [
      {
        "@type": "Audience",
        audienceType: "Students",
        geographicArea: {
          "@type": "Place",
          name: "New Jersey",
          geo: {
            "@type": "GeoCoordinates",
            latitude: 40.0583, // New Jersey's approximate latitude
            longitude: -74.4057, // New Jersey's approximate longitude
          },
        },
      },
      {
        "@type": "Audience",
        audienceType: "Workers",
        geographicArea: {
          "@type": "Place",
          name: "New Jersey",
          geo: {
            "@type": "GeoCoordinates",
            latitude: 40.0583, // New Jersey's approximate latitude
            longitude: -74.4057, // New Jersey's approximate longitude
          },
        },
      },
    ];

    const courseInstance = {
      "@type": "CourseInstance",
      courseMode: training.online ? "online" : "onsite",
      instructor: {
        "@type": "Person",
        name: training.provider.contactName,
        jobTitle: training.provider.contactTitle,
        telephone: training.provider.phoneNumber,
      },
      courseWorkload: training.totalClockHours
        ? `PT${training.totalClockHours}H`
        : "PT0H",
    };

    const offer = {
      "@type": "Offer",
      url: training.provider.url,
      priceCurrency: "USD",
      price: training.totalCost,
      eligibleRegion: {
        "@type": "Place",
        name: "New Jersey",
      },
      category: "Tuition",
    };

    return {
      "@context": "http://schema.org",
      "@type": "Course",
      name: training.name,
      description: training.description,
      provider: {
        "@type": "Organization",
        name: training.provider.name,
        sameAs: training.provider.url,
      },
      audience: audience,
      identifier: {
        "@type": "PropertyValue",
        name: "Program ID",
        value: training.id,
      },
      hasCourseInstance: courseInstance,
      offers: offer,
    };
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  const providerAddress = `${training.provider.address.street1} ${
    training.provider.address.street2 ? training.provider.address.street2 : ""
  } ${training.provider.address.city}, ${training.provider.address.state} ${
    training.provider.address.zipCode ? training.provider.address.zipCode : ""
  }`;

  const counties =
    training.localExceptionCounty && training.localExceptionCounty.length > 0
      ? training.localExceptionCounty.length > 1
        ? training.localExceptionCounty.slice(0, -1).join(", ") +
          " and " +
          training.localExceptionCounty.slice(-1)
        : training.localExceptionCounty[0]
      : [];

  return (
    <div ref={componentRef}>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd(training)),
        }}
      />
      <PageBanner
        subHeading={training.provider.name}
        theme="navy"
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
        saveButtons={
          <Flex
            elementTag="ul"
            columnBreak="none"
            justifyContent="flex-end"
            alignItems="center"
            className="save-controls unstyled desktop-only"
          >
            <li>
              <Button
                type="button"
                unstyled
                className={`link-format-blue${copy ? " green" : ""}`}
                onClick={copyHandler}
              >
                <Flex gap="xxs" direction="column" alignItems="center">
                  <IconSelector name="LinkSimple" size={26} />
                  <span>{copy ? "Copied!" : "Copy link"}</span>
                </Flex>
              </Button>
            </li>
            <li>
              <Button
                type="button"
                unstyled
                className="link-format-blue"
                onClick={printHandler}
              >
                <Flex gap="xxs" direction="column" alignItems="center">
                  <IconSelector
                    name="Printer"
                    size={26}
                    className={copy ? "green" : undefined}
                  />

                  <span className="mlxs weight-500">Print and Save</span>
                </Flex>
              </Button>
            </li>
          </Flex>
        }
        title={training.name}
        className={
          counties.length === 0 && !training.inDemand
            ? "counties-empty"
            : undefined
        }
        infoBlocks={{
          titleBlock: {
            copy: `In-Demand in ${
              training.inDemand ? "all of New Jersey" : counties
            }.`,
            message: "This training may be eligible for funding from your ",
            link: {
              copy: "One-Stop Career Center.",
              url: "https://www.nj.gov/labor/career-services/contact-us/one-stops/",
            },
          },
          rateBlock: {
            copy: "Program Employment Rate",
            definition:
              "Percentage of enrolled students employed within 6 months of this class or classes like it at this provider. * This information is missing because we haven't received enough data from this institute.",
            number: training.percentEmployed
              ? formatPercentEmployed(training.percentEmployed)
              : "N/A",
          },
          costBlock: {
            copy: "Avg Salary after Program",
            definition:
              "Average salary 6 months after completion of this class or classes like it at this provider. * This information is missing because we haven't received enough data from this institute.",
            number: training.averageSalary
              ? toUsCurrency(training.averageSalary)
              : "N/A",
          },
        }}
      />
      <section className="body-copy">
        <div className="container">
          <div className="inner">
            <div>
              <LabelBox
                color="green"
                title="Description"
                className="description"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: desc,
                  }}
                />
              </LabelBox>

              <LabelBox color="green" title="Quick Facts" className="stats">
                {training.prerequisites && (
                  <Flex alignItems="flex-start" gap="xxs" elementTag="p">
                    <Flex alignItems="center" gap="xxs" elementTag="span">
                      <ListBullets size={18} />
                      <span>Prerequisites: </span>
                    </Flex>
                    <strong>{training.prerequisites}</strong>
                  </Flex>
                )}
                {training.certifications && (
                  <Flex alignItems="center" gap="xxs" elementTag="p">
                    <GraduationCap size={18} />
                    <span>{training.certifications}</span>
                  </Flex>
                )}

                {training.calendarLength && (
                  <Flex alignItems="center" gap="xxs" elementTag="p">
                    <CalendarBlank size={18} />
                    <span>Completion Time: </span>
                    <strong>{calendarLength(training.calendarLength)}</strong>
                  </Flex>
                )}

                {!!training.totalClockHours && (
                  <Flex alignItems="center" gap="xxs" elementTag="p">
                    <Clock size={18} />
                    <span>Total Hours: </span>
                    <strong>
                      <Tooltip copy="Total Hours are the total number of actual hours spent attending class or instructional activity in order to complete the program.">
                        <Info weight="fill" size={18} />
                      </Tooltip>
                      {training.totalClockHours} hours
                    </strong>
                  </Flex>
                )}

                {training.cipDefinition && (
                  <>
                    <Flex alignItems="center" gap="xxs" elementTag="p">
                      <BookBookmark weight="fill" size={18} />
                      <Button
                        type="button"
                        unstyled
                        onClick={(e) => {
                          e.preventDefault();
                          setCipDrawerOpen(!cipDrawerOpen);
                        }}
                      >
                        <span>CIP Code: </span>
                      </Button>
                      <a
                        href={`https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cip=${formatCip(
                          training.cipDefinition.cipcode
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {formatCip(training.cipDefinition.cipcode)}
                      </a>
                    </Flex>
                    <p>
                      <strong>{training.cipDefinition.ciptitle}</strong>
                    </p>
                  </>
                )}
              </LabelBox>
              <LabelBox
                color="green"
                title="Associated Occupations"
                className="occupations"
              >
                {training.occupations?.map((occupation: any) => (
                  <LinkObject
                    key={occupation.soc}
                    url={`/occupation/${occupation.soc}`}
                  >
                    {occupation.title}
                  </LinkObject>
                ))}
              </LabelBox>
              <LabelBox color="green" title="How to get funding">
                <p>
                  Trainings related to occupations on the{" "}
                  <LinkObject url="/in-demand-occupations">
                    In - Demand Occupations List
                  </LinkObject>{" "}
                  may be eligible for funding. Contact your local One-Stop
                  Career Center for more information regarding program and
                  training availability.
                </p>
                <Button
                  type="link"
                  outlined
                  link="https://www.nj.gov/labor/career-services/contact-us/one-stops/"
                  iconSuffix="ArrowSquareOut"
                >
                  New Jersey&apos;s One-Stop Career Centers
                </Button>
                <p>
                  You can also check out other tuition assistance opportunities.
                </p>
                <Button
                  defaultStyle="secondary"
                  outlined
                  type="link"
                  link="/support-resources/tuition-assistance"
                >
                  View Tuition Assistance Resource
                </Button>
              </LabelBox>
            </div>
            <div>
              <LabelBox color="green" title="Cost" className="cost">
                <CostTable
                  items={[
                    {
                      cost: training.tuitionCost,
                      title: "Tuition",
                    },
                    {
                      cost: training.feesCost,
                      title: "Fees",
                    },
                    {
                      cost: training.booksMaterialsCost,
                      title: "Books & Materials",
                    },
                    {
                      cost: training.suppliesToolsCost,
                      title: "Supplies & Tools",
                    },
                    {
                      cost: training.otherCost,
                      title: "Other",
                    },
                  ]}
                />
              </LabelBox>
              <LabelBox
                color="green"
                title="Provider Details"
                className="provider"
              >
                <p>
                  <GraduationCap size={18} weight="bold" />
                  <span>{training.provider.name}</span>
                </p>
                <p>
                  <MapPin size={18} weight="bold" />
                  <span>
                    <LinkObject
                      noIndicator
                      url={`https://www.google.com/maps/search/?api=1&query=${training.provider.name} ${providerAddress}`}
                    >
                      {training.provider.address.street1} <br />
                      {training.provider.address.street2 ? (
                        <>
                          {training.provider.address.street2} <br />
                        </>
                      ) : (
                        ""
                      )}
                      {training.provider.address.city},{" "}
                      {training.provider.address.state}{" "}
                      {training.provider.address.zipCode}
                    </LinkObject>
                  </span>
                </p>
                <p>
                  <User size={18} weight="bold" />
                  <span>
                    {training.provider.contactName} <br />
                    {training.provider.contactTitle} <br />
                    {formatPhoneNumber(training.provider.phoneNumber)}{" "}
                    {training.provider.phoneExtension &&
                      `Ext: ${training.provider.phoneExtension}`}
                  </span>
                </p>
                <p>
                  <LinkSimpleHorizontal size={18} weight="bold" />
                  <span>
                    <LinkObject noIndicator url={training.provider.url}>
                      {training.provider.url}
                    </LinkObject>
                  </span>
                </p>
              </LabelBox>
              <LabelBox
                color="green"
                title="Provider Services"
                className="services"
              >
                {training.hasEveningCourses && (
                  <p>
                    <Moon size={18} weight="bold" />
                    <span>This provider offers evening courses</span>
                  </p>
                )}
                {training.languages.length !== 0 && (
                  <p>
                    <Globe size={18} weight="bold" />
                    <span>Programs may be available in other languages</span>
                  </p>
                )}
                {training.isWheelchairAccessible && (
                  <p>
                    <WheelchairMotion size={18} weight="bold" />
                    <span>The facility is wheelchair accessible</span>
                  </p>
                )}
                {training.hasJobPlacementAssistance && (
                  <p>
                    <Briefcase size={18} weight="bold" />
                    <span>
                      Job placement and/or career assistance is available at
                      this provider
                    </span>
                  </p>
                )}
                {training.hasChildcareAssistance && (
                  <p>
                    <Baby size={18} />
                    <span>
                      This provider has childcare at the facility or provides
                      assistance with finding childcare
                    </span>
                  </p>
                )}
                <p>
                  Services are subject to provider details, contact this
                  provider for more information on services
                </p>
              </LabelBox>
              <Button
                type="link"
                highlight="orange"
                label="See something wrong? Report an issue."
                link="/contact"
                newTab
                iconPrefix="Flag"
              />
            </div>
          </div>
        </div>
      </section>

      <Drawer open={cipDrawerOpen} setOpen={setCipDrawerOpen}>
        <Heading level={3}>
          Classification of Instructional Programs (CIP) codes
        </Heading>
        <p>
          Classification of Instructional Programs (CIP) codes, are standardized
          codes used to categorize academic programs and courses. Each program
          or course is assigned a CIP code based on its content and subject
          matter.<sup>1.</sup> <sup>2.</sup>
        </p>
        <p>
          You can find a list of CIP codes{" "}
          <a
            href="https://nces.ed.gov/ipeds/cipcode/browse.aspx?y=56"
            target="_blank"
            rel="noopener noreferrer"
          >
            here.
          </a>
        </p>
        <br />
        <div className="small sources">
          <span>
            <sup>1.</sup> Sources
            <ul>
              <li>
                National Center for Education Statistics (NCES):
                <br />
                <a
                  href="https://nces.ed.gov/ipeds/cipcode/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://nces.ed.gov/ipeds/cipcode/
                </a>
              </li>
              <li>
                U.S. Department of Education:
                <br />
                <a
                  href="https://www.ed.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.ed.gov/
                </a>
              </li>
            </ul>
          </span>
          <p>
            <sup>2.</sup> This definition was generated with the help of{" "}
            <a
              href="https://chat.openai.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              chatGPT(3.5)
            </a>
          </p>
        </div>
      </Drawer>
    </div>
  );
};

export { Content };
