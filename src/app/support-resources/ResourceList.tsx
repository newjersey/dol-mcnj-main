"use client";

import { ResourceCardProps, TagProps } from "@utils/types";
import { SupportResourcesPageProps } from "./page";
import { ResourceCard } from "@components/modules/ResourceCard";
import { FilterControl } from "@components/blocks/FilterControl";
import { CtaBanner } from "@components/blocks/CtaBanner";
import { useEffect, useState } from "react";
import { Tag } from "@components/modules/Tag";

export const ResourceList = ({
  resources,
  tags,
}: SupportResourcesPageProps) => {
  const [selectedTags, setSelectedTags] = useState<TagProps[]>([]);
  const [filteredResources, setFilteredResources] = useState<
    ResourceCardProps[]
  >([]);
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
    if (selectedTags.length > 0) {
      const filtered = resources.items.filter((resource: ResourceCardProps) => {
        const resourceTags = resource.tags.items.map((tag) => tag.title);
        return selectedTags.some((tag) => resourceTags.includes(tag.title));
      });
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources.items);
    }
  }, [selectedTags]);

  return (
    <section>
      <div className="container flex gap-8 items-start">
        <FilterControl
          className="w-[400px]"
          onChange={(selected) => setSelectedTags(selected)}
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
        <div className="w-[calc(100%-400px)] flex flex-col gap-8">
          <p className="text-[24px] font-bold">
            {filteredResources.length} of {resources.items.length} items
          </p>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tag) => (
                <button
                  key={tag.sys.id}
                  onClick={() => {
                    // uncheck the tag in the filter control
                    setSelectedTags((prev) =>
                      prev.filter((t) => t.sys.id !== tag.sys.id)
                    );
                  }}
                >
                  <Tag suffixIcon="X" color="blue" title={tag.title} />
                </button>
              ))}
            </div>
          )}

          {filteredResources.map((resource) => (
            <ResourceCard key={resource.sys.id} {...resource} />
          ))}
        </div>
      </div>
    </section>
  );
};
