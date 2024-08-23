"use client";
import { PageBanner } from "@components/blocks/PageBanner";
import { MainLayout } from "@components/global/MainLayout";
import { Button } from "@components/modules/Button";
import { ContentfulRichText } from "@components/modules/ContentfulRichText";
import { Drawer } from "@components/modules/Drawer";
import { DropContent } from "@components/modules/DropContent";
import { Heading } from "@components/modules/Heading";
import { ResponsiveImage } from "@components/modules/ResponsiveImage";
import { SectionHeading } from "@components/modules/SectionHeading";
import { IconNames } from "@utils/enums";
import { CareerPathwaysPageProps, IndustryProps } from "@utils/types";
import { ReactNode, useState } from "react";

export const PathwaysLayout = ({
  page,
  children,
  navs,
  currentIndustry,
}: {
  children: ReactNode;
  page: CareerPathwaysPageProps["page"];
  navs: any;
  currentIndustry?: IndustryProps;
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <MainLayout {...navs}>
      <div className="page careerPathways">
        <PageBanner
          {...page.pageBanner}
          finalCrumb={currentIndustry?.title}
          breadcrumbsCollection={
            currentIndustry
              ? {
                  items: [
                    {
                      copy: "Home",
                      url: "/",
                    },
                    {
                      copy: "Career Pathways",
                      url: "/career-pathways",
                    },
                  ],
                }
              : page.pageBanner.breadcrumbsCollection
          }
        />
        <section className="industries">
          <div className="container">
            <SectionHeading
              heading="Select an Industry"
              description="Explore popular industries in New Jersey. More Industries coming soon!"
            />
            <div className="buttons">
              {page.industries.items
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((industry) => {
                  const icon =
                    industry.slug === "manufacturing"
                      ? "Factory"
                      : industry.slug === "healthcare"
                        ? "Stethoscope"
                        : industry.slug === "tdl"
                          ? "Truck"
                          : ("Building" as IconNames);
                  return (
                    <Button
                      info={
                        currentIndustry?.slug === industry.slug
                          ? undefined
                          : true
                      }
                      key={industry.sys.id}
                      iconPrefix={icon}
                      type="link"
                      highlight={
                        currentIndustry?.slug === industry.slug
                          ? "purple"
                          : undefined
                      }
                      label={industry.title}
                      link={`/career-pathways/${industry.slug}`}
                    />
                  );
                })}
            </div>
            {currentIndustry && (
              <Button
                tag
                type="button"
                iconPrefix="Info"
                onClick={() => {
                  setDrawerOpen(!drawerOpen);
                }}
              >
                <span>
                  What is an <strong>{currentIndustry.title}</strong> like in
                  New Jersey?
                </span>
              </Button>
            )}
            {currentIndustry?.industryAccordionCollection &&
              currentIndustry?.industryAccordionCollection.items.length > 0 && (
                <Drawer open={drawerOpen} setOpen={setDrawerOpen}>
                  <Heading level={3}>
                    {currentIndustry.title} in New Jersey
                  </Heading>
                  {currentIndustry?.description && (
                    <ContentfulRichText
                      document={currentIndustry?.description?.json}
                    />
                  )}
                  {currentIndustry?.photo && (
                    <div className="image">
                      {currentIndustry?.photo && (
                        <ResponsiveImage
                          src={currentIndustry?.photo.url}
                          alt={`${currentIndustry.title} in New Jersey` || ""}
                          isBackground
                          height={currentIndustry?.photo.height}
                          width={currentIndustry?.photo.width}
                        />
                      )}
                    </div>
                  )}

                  {currentIndustry.industryAccordionCollection?.items.map(
                    (item, index: number) => {
                      const industryIcon =
                        index === 0 && currentIndustry.slug === "healthcare"
                          ? "Stethoscope"
                          : index === 0 &&
                              currentIndustry.slug === "manufacturing"
                            ? "Factory"
                            : index === 0 && currentIndustry.slug === "tdl"
                              ? "Truck"
                              : undefined;

                      const icon = index === 1 ? "Fire" : "Star";
                      return (
                        <DropContent
                          headingLevel={4}
                          key={item.sys.id}
                          sys={item.sys}
                          icon={(industryIcon || icon) as IconNames}
                          copy={item.title}
                          message={item.copy}
                        />
                      );
                    },
                  )}
                </Drawer>
              )}
          </div>
        </section>
        {children}
      </div>
    </MainLayout>
  );
};
