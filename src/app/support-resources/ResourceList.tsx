"use client";

import { ResourceCardProps, TagProps } from "@utils/types";
import { SupportResourcesPageProps } from "./page";
import { ResourceCard } from "@components/modules/ResourceCard";
import { FilterControl } from "@components/blocks/FilterControl";
import { CtaBanner } from "@components/blocks/CtaBanner";
import { useEffect, useState } from "react";
import { Tag } from "@components/modules/Tag";
import { CaretDownIcon } from "@phosphor-icons/react";
import Fuse from "fuse.js";
import { trackPageLoadTime } from "@utils/analytics";

export const ResourceList = ({
  resources,
  tags,
}: SupportResourcesPageProps) => {
  const [selectedTags, setSelectedTags] = useState<TagProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"aToZ" | "zToA">("aToZ");
  const [filteredResources, setFilteredResources] = useState<
    ResourceCardProps[]
  >([]);

  // Track page load time for tuition assistance specifically
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath.includes("tuition-assistance")) {
        setTimeout(() => {
          trackPageLoadTime(
            "Tuition Assistance Page",
            "/support-resources/tuition-assistance"
          );
        }, 100);
      }
    }
  }, []);

  const organizedTags = tags?.items.reduce((acc, tag) => {
    const category = tag.category?.title || "Other";
    const sysId = tag.category?.sys?.id || "other-category";
    if (!acc[category]) {
      acc[category] = {
        title: category,
        sys: {
          id: sysId,
        },
        tags: [] as TagProps[],
      };
    }
    acc[category].tags.push(tag);
    return acc;
  }, {} as Record<string, { title: string; sys: { id: string }; tags: TagProps[] }>);

  // make sure "Audience" object is listed last
  if (organizedTags && organizedTags["Audience"]) {
    const audienceTags = organizedTags["Audience"];
    delete organizedTags["Audience"];
    organizedTags["Audience"] = audienceTags;
  }

  // make organizedTags an array
  const categories = Object.entries(organizedTags || {}).map(
    ([title, value]) => {
      const typedValue = value as {
        title: string;
        sys: { id: string };
        tags: TagProps[];
      };
      return {
        heading: title,
        sys: typedValue.sys,
        items: typedValue.tags,
      };
    }
  );

  useEffect(() => {
    const baseList =
      selectedTags.length > 0
        ? resources.items.filter((resource) => {
            const resourceTags = resource.tags.items.map((tag) => tag.title);
            return selectedTags.some((tag) => resourceTags.includes(tag.title));
          })
        : resources.items;

    let finalList = baseList;

    if (searchQuery) {
      const fuse = new Fuse(baseList, {
        keys: ["title", "description"],
        threshold: 0.4,
        distance: 10,
        minMatchCharLength: 2,
        ignoreLocation: true,
      });
      finalList = fuse.search(searchQuery).map((r) => r.item);
    }

    const alphabeticalOrder = (a: ResourceCardProps, b: ResourceCardProps) =>
      sortOrder === "aToZ"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);

    setFilteredResources(finalList.sort(alphabeticalOrder));
  }, [selectedTags, searchQuery, sortOrder, resources.items]);

  return (
    <section className="resourceList">
      <div className="container flex flex-col tabletLg:flex-row gap-8 items-start">
        <FilterControl
          className="w-full tabletLg:w-[400px]"
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          onType={(type) => {
            setSearchQuery(type);

            const baseList =
              selectedTags.length > 0
                ? resources.items.filter((resource) => {
                    const resourceTags = resource.tags.items.map(
                      (tag) => tag.title
                    );
                    return selectedTags.some((tag) =>
                      resourceTags.includes(tag.title)
                    );
                  })
                : resources.items;

            if (!type) {
              const alphabeticalOrder = (
                a: ResourceCardProps,
                b: ResourceCardProps
              ) =>
                sortOrder === "aToZ"
                  ? a.title.localeCompare(b.title)
                  : b.title.localeCompare(a.title);

              setFilteredResources([...baseList].sort(alphabeticalOrder));
              return;
            }

            const fuse = new Fuse(baseList, {
              keys: ["title", "description"],
              threshold: 0.4,
              distance: 10,
              minMatchCharLength: 2,
              ignoreLocation: true,
            });

            const results = fuse.search(type).map((r) => r.item);
            setFilteredResources(results);
          }}
          onChange={(selected) => {
            const tagGroup = selected.sort((a, b) => {
              const aCategory = a.category?.slug || "other";
              const bCategory = b.category?.slug || "other";
              return aCategory.localeCompare(bCategory);
            });

            setSelectedTags(tagGroup);
          }}
          selected={selectedTags}
          boxLabel="Filters"
          groups={categories}
        >
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
        <div className="tabletLg:w-[calc(100%-400px)] flex flex-col gap-4">
          <div className="resourceHeading flex justify-between items-start mb-4">
            <div>
              <p className="text-[24px] font-bold m-0">
                {filteredResources.length} of {resources.items.length} items
              </p>
              <p className="mt-2">
                <strong>filtered by:</strong>
              </p>
            </div>
            <div>
              <label className="w-[256px] flex flex-col gap-2 relative">
                <strong>Sort by:</strong>
                <select
                  className="w-full"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSortOrder(value as "aToZ" | "zToA");
                    const sortedResources = [...filteredResources].sort(
                      (a, b) => {
                        if (value === "aToZ") {
                          return a.title.localeCompare(b.title);
                        } else {
                          return b.title.localeCompare(a.title);
                        }
                      }
                    );
                    setFilteredResources(sortedResources);
                  }}
                >
                  <option value="aToZ">A-Z</option>
                  <option value="zToA">Z-A</option>
                </select>
                <CaretDownIcon
                  size={22}
                  weight="bold"
                  className="absolute right-2 bottom-size8"
                />
              </label>
            </div>
          </div>
          {(searchQuery || selectedTags.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                  }}
                >
                  <Tag
                    suffixIcon="X"
                    iconWeight="bold"
                    color="base"
                    title={`"${searchQuery}"`}
                  />
                </button>
              )}
              {selectedTags.map((tag) => {
                const tagColor =
                  tag.category.slug === "career-support"
                    ? "purple"
                    : tag.category.slug === "other"
                    ? "blue"
                    : tag.category.slug === "tuition-assistance"
                    ? "green"
                    : "navy";
                return (
                  <button
                    key={tag.sys.id}
                    onClick={() => {
                      setSelectedTags((prev) => {
                        const tagGroup = prev.filter(
                          (t) => t.sys.id !== tag.sys.id
                        );
                        const sortedByCategory = tagGroup.sort((a, b) => {
                          const aCategory = a.category?.slug || "other";
                          const bCategory = b.category?.slug || "other";
                          return aCategory.localeCompare(bCategory);
                        });

                        return sortedByCategory;
                      });
                    }}
                  >
                    <Tag
                      suffixIcon="X"
                      iconWeight="bold"
                      color={tagColor}
                      title={tag.title}
                    />
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-8">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.sys.id} {...resource} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
