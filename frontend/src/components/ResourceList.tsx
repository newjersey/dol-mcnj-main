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

  useEffect(() => {
    if (resources && resources?.length > 0) {
      if (selectedTags.length > 0) {
        const filtered = resources.filter((resource) => {
          const resourceTags = resource.tags.items.map((tag) => tag.title);
          return selectedTags.some((tag) => resourceTags.includes(tag.title));
        });
        setFilteredResources(filtered);
      } else {
        console.log(resources);
        setFilteredResources(resources);
      }
    }
  }, [selectedTags]);

  const themeColor =
    category === "Career Support" ? "purple" : category === "Tuition Assistance" ? "green" : "navy";

  return (
    <section className="resource-list">
      {resources && resources?.length > 0 && (
        <div className="container">
          <div className="sidebar">
            <FilterControls
              onChange={(selected) =>
                setSelectedTags(
                  selected
                    .map((tag) => tag)
                    .sort((a, b) => b.category.slug.localeCompare(a.category.slug)),
                )
              }
              boxLabel="Filters"
              groups={[
                ...tags.map((tagGroup) => ({
                  heading: tagGroup.category.title,
                  items: tagGroup.tags || [],
                })),
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
                count={filteredResources.length}
                totalCount={resources.length}
                theme={themeColor}
              />
            </div>

            {filteredResources.map((resource) => {
              return <ResourceCard {...resource} theme={themeColor} key={resource.sys.id} />;
            })}
            <FooterCta heading={cta.footerCtaHeading} link={cta.footerCtaLink} />
          </div>
        </div>
      )}
    </section>
  );
};
