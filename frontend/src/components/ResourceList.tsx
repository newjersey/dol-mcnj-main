import { useEffect, useState } from "react";
import {
  RelatedCategoryProps,
  ResourceCategoryPageProps,
  ResourceItemProps,
  TagProps,
} from "../types/contentful";
import { FilterControls } from "./FilterControls";
import { ResourceCard } from "./ResourceCard";
import { ResourceListHeading } from "./modules/ResourceListHeading";
import { FooterCta } from "./FooterCta";
import Fuse from "fuse.js";

interface ResourceTagListProps {
  audience: TagProps[];
  category?: string;
  cta: ResourceCategoryPageProps["cta"];
  info?: string;
  related?: RelatedCategoryProps[];
  tags: {
    category: { slug: string; title: string };
    tags: TagProps[];
  }[];
  resources?: ResourceItemProps[];
}

export const ResourceList = ({
  audience,
  category = "All Resources",
  cta,
  resources,
  tags,
}: ResourceTagListProps) => {
  const [selectedTags, setSelectedTags] = useState<TagProps[]>([]);
  const [filteredResources, setFilteredResources] = useState<ResourceItemProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ResourceItemProps[] | null>(null);

  useEffect(() => {
    if (resources && resources?.length > 0) {
      if (selectedTags.length > 0) {
        const filtered = resources.filter((resource) => {
          const resourceTags = resource.tags.items.map((tag) => tag.title);
          return selectedTags.some((tag) => resourceTags.includes(tag.title));
        });
        setFilteredResources(filtered);
      } else {
        setFilteredResources(resources);
      }
    }
  }, [searchQuery, selectedTags]);

  const themeColor =
    category === "Career Support" ? "purple" : category === "Tuition Assistance" ? "green" : "navy";

  const cards =
    ((searchResults ?? []).length > 0
      ? searchResults
      : searchQuery
        ? searchResults
        : filteredResources) ?? [];
  const alphaSortedCards = cards.sort((a, b) => a.title.localeCompare(b.title));

  const allTags =
    tags.length > 0
      ? tags.map((tagGroup) => ({
          heading: tagGroup.category.title,
          items: tagGroup.tags || [],
        }))
      : [
          {
            heading: "Tags",
            items: [],
          },
        ];

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(null);
    }
  }, [searchQuery]);

  return (
    <section className="resource-list">
      {resources && resources?.length > 0 && (
        <div className="container">
          <div className="sidebar">
            <FilterControls
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
              onType={(type) => {
                setSearchQuery(type);

                if (!type || !filteredResources.length) {
                  setSearchResults(null);
                  return;
                }

                const fuse = new Fuse(filteredResources, {
                  keys: ["title", "description"],
                  threshold: 0.4,
                  distance: 10,
                  minMatchCharLength: 2,
                  ignoreLocation: true,
                });

                const results = fuse.search(type).map((r) => r.item);
                setSearchResults(results);
              }}
              onChange={(selected) =>
                setSelectedTags(
                  selected
                    .map((tag) => tag)
                    .sort((a, b) => b.category.slug.localeCompare(a.category.slug)),
                )
              }
              boxLabel="Filters"
              groups={[
                ...allTags,
                {
                  heading: "Audience",
                  items: audience || [],
                },
              ]}
            />
            <FooterCta heading={cta.footerCtaHeading} link={cta.footerCtaLink} />
          </div>

          <div className="cards">
            <div className="listing-header">
              <ResourceListHeading
                tags={selectedTags}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                count={alphaSortedCards.length}
                totalCount={resources.length}
              />
            </div>

            {alphaSortedCards.map((resource) => (
              <ResourceCard {...resource} theme={themeColor} key={resource.sys.id} />
            ))}
            <FooterCta heading={cta.footerCtaHeading} link={cta.footerCtaLink} />
          </div>
        </div>
      )}
    </section>
  );
};
