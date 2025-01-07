"use client";
import { FilterControl } from "@components/blocks/FilterControl";
import { Alert } from "@components/modules/Alert";
import { ResourceCard } from "@components/modules/ResourceCard";
import {
  ResourceCardProps,
  ResourceCategoryPageProps,
  ResourceTagProps,
  SectionIcons,
} from "@utils/types";
import { useEffect, useState } from "react";
import { HeadingBlock } from "./HeadingBlock";
import { ResourceLinkBox } from "@components/modules/ResourceLinkBox";
import { CtaBanner } from "@components/blocks/CtaBanner";

export const Filter = ({
  page,
  tags,
  audience,
  listingItems,
}: ResourceCategoryPageProps) => {
  const [selectedTags, setSelectedTags] = useState<ResourceTagProps[]>([]);
  const [filteredResources, setFilteredResources] = useState<
    ResourceCardProps[]
  >([]);

  const themeColor =
    page.items[0].title === "Career Support"
      ? "purple"
      : page.items[0].title === "Tuition Assistance"
      ? "green"
      : "navy";

  useEffect(() => {
    if (selectedTags.length > 0) {
      const filtered = listingItems.resources.items.filter(
        (resource: ResourceCardProps) => {
          const resourceTags = resource.tagsCollection.items.map(
            (tag) => tag.title
          );
          return selectedTags.some((tag) => resourceTags.includes(tag.title));
        }
      );
      setFilteredResources(filtered);
    } else {
      setFilteredResources(listingItems.resources.items);
    }
  }, [selectedTags]);

  return (
    <section className="filter resourceCardsBlock">
      <div className="container">
        <div className="inner">
          <div className="filterWrapper">
            <FilterControl
              onChange={(selected) => {
                setSelectedTags(selected);
              }}
              boxLabel={`${page.items[0].title} Filters`}
              groups={[
                {
                  heading: page.items[0].title,
                  items: tags.items,
                },
                {
                  heading: "Audience",
                  items: audience.items,
                },
              ]}
            >
              {page.items[0].related && (
                <ResourceLinkBox
                  heading="Related Resources"
                  theme="navy"
                  links={page.items[0].related?.items.map((item) => {
                    return {
                      url: `/support-resources/${item.slug}`,
                      copy: item.title + " Resources",
                      systemIcon: "supportBold" as SectionIcons,
                      sys: { id: item.sys.id },
                    };
                  })}
                />
              )}
              <CtaBanner
                headingLevel={3}
                className="desktop-only"
                heading="Still have questions?"
                inlineButtons
                items={[
                  {
                    copy: "Contact Us",
                    url: "/contact",
                  },
                ]}
              />
            </FilterControl>
          </div>
          <div className="resourceCards">
            {page.items[0].infoBox && (
              <>
                <Alert type="info" copy={page.items[0].infoBox} />
                <hr />
              </>
            )}
            <HeadingBlock
              totalCount={listingItems?.resources.items.length}
              count={filteredResources.length}
              tags={selectedTags}
              theme={themeColor}
            />
            <div className="cards">
              {(selectedTags.length > 0
                ? filteredResources
                : listingItems.resources.items
              ).map((card) => (
                <ResourceCard key={card.sys.id} {...card} />
              ))}
            </div>
            {page.items[0].related && (
              <ResourceLinkBox
                heading="Related Resources"
                theme="navy"
                links={page.items[0].related?.items.map((item) => {
                  return {
                    url: `/support-resources/${item.slug}`,
                    copy: item.title + " Resources",
                    systemIcon: "supportBold" as SectionIcons,
                    sys: { id: item.sys.id },
                  };
                })}
              />
            )}
            <CtaBanner
              headingLevel={3}
              className="mobile-only"
              heading="Still have questions?"
              inlineButtons
              items={[
                {
                  copy: "Contact Us",
                  url: "/contact",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
