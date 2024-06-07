import { useEffect, useState } from "react";
import {
  RelatedCategoryProps,
  ResourceCategoryPageProps,
  ResourceItemProps,
  ResourceListProps,
  TagProps,
} from "../types/contentful";
import { FilterControls } from "./FilterControls";
import { ResourceCard } from "./ResourceCard";
import { ResourceListHeading } from "./modules/ResourceListHeading";
import { FooterCta } from "./FooterCta";
import { Selector } from "../svg/Selector";
import { useContentful } from "../utils/useContentful";
import { AlertBar } from "./AlertBar";

interface ResourceTagListProps {
  audience: TagProps[];
  category?: string;
  cta: ResourceCategoryPageProps["cta"];
  info?: string;
  related?: RelatedCategoryProps[];
  tags: TagProps[];
}

export const ResourceList = ({
  audience,
  category = "All Resources",
  cta,
  info,
  related,
  tags,
}: ResourceTagListProps) => {
  // get the title from all tags and audience and map them to a single array
  const allTags = [...tags].map((tag) => tag.title);

  const [selectedTags, setSelectedTags] = useState<TagProps[]>([]);
  const [filteredResources, setFilteredResources] = useState<ResourceItemProps[]>([]);
  const [uniqueTags, setUniqueTags] = useState<TagProps[]>([]);
  const [uniqueAudience, setUniqueAudience] = useState<TagProps[]>([]);

  const data: ResourceListProps = useContentful({
    path: `/resource-listing/${JSON.stringify(allTags).replace(/\//g, "%2F")}`,
  });

  useEffect(() => {
    if (data) {
      if (selectedTags.length > 0) {
        const filtered = data.resources.items.filter((resource) => {
          const resourceTags = resource.tags.items.map((tag) => tag.title);
          return selectedTags.some((tag) => resourceTags.includes(tag.title));
        });
        setFilteredResources(filtered);
      } else {
        setFilteredResources(data.resources.items);
      }
    }
  }, [selectedTags]);

  useEffect(() => {
    if (data) {
      const usedTags = data.resources.items
        .map((resource) => resource.tags.items.map((tag) => tag.title))
        .flat()
        .filter((tag, index, self) => self.indexOf(tag) === index);

      setUniqueTags([...tags].filter((tag) => usedTags.includes(tag.title)));

      const usedAudience = data.resources.items
        .map((resource) => resource.tags.items.map((tag) => tag.title))
        .flat()
        .filter((tag, index, self) => self.indexOf(tag) === index);

      setUniqueAudience([...audience].filter((tag) => usedAudience.includes(tag.title)));
    }
  }, [filteredResources]);

  const themeColor =
    category === "Career Support" ? "purple" : category === "Tuition Assistance" ? "green" : "navy";

  return (
    <section className="resource-list">
      {data && (
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
              boxLabel={`${category} Filters`}
              groups={[
                {
                  heading: category,
                  items: uniqueTags || [],
                },
                {
                  heading: "Audience",
                  items: uniqueAudience || [],
                },
              ]}
            />{" "}
            {related && (
              <div className="related">
                <h3>Related Resources</h3>

                {related.map((item) => (
                  <a
                    className="usa-button"
                    href={`/support-resources/${item.slug}`}
                    key={item.sys.id}
                  >
                    <Selector name="supportBold" />
                    {item.title} Resources
                  </a>
                ))}
              </div>
            )}
            <FooterCta heading={cta.footerCtaHeading} link={cta.footerCtaLink} />
          </div>

          <div className="cards">
            {info && <AlertBar type="info" copy={info} />}
            <div className="listing-header">
              <ResourceListHeading
                tags={selectedTags}
                count={filteredResources.length}
                totalCount={data.resources.items.length}
                theme={themeColor}
              />
            </div>

            {filteredResources.map((resource) => {
              return <ResourceCard {...resource} theme={themeColor} key={resource.sys.id} />;
            })}
            {related && (
              <div className="related">
                <h3>Related Resources</h3>
                {related.map((item) => (
                  <a
                    className="usa-button"
                    href={`/support-resources/${item.slug}`}
                    key={item.sys.id}
                  >
                    <Selector name="supportBold" />
                    {item.title} Resources
                  </a>
                ))}
              </div>
            )}
            <FooterCta heading={cta.footerCtaHeading} link={cta.footerCtaLink} />
          </div>
        </div>
      )}
    </section>
  );
};
