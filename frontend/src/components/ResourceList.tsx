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
import { FundingBox } from "./modules/FundingBox";
import { ArrowRight } from "@phosphor-icons/react";
import { LinkObject } from "./modules/LinkObject";

interface ResourceTagListProps {
  audience: TagProps[];
  category?: string;
  cta: ResourceCategoryPageProps["cta"];
  fundingBox?: boolean;
  info?: string;
  related?: RelatedCategoryProps[];
  tags: TagProps[];
}

export const ResourceList = ({
  audience,
  category = "All Resources",
  cta,
  fundingBox,
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
  const [funding, setFunding] = useState(false);

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

  useEffect(() => {
    const hasFundingTag = selectedTags.some((tag) =>
      ["Grant", "Loan", "Job training"].includes(tag.title),
    );
    setFunding(hasFundingTag);
  }, [selectedTags]);

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

            {(fundingBox || funding) && (
              <FundingBox
                heading="Funding for In-Demand Occupations"
                headingLevel={2}
                className="resource-list-info"
              >
                <p>
                  Trainings related to occupations on the{" "}
                  <LinkObject url="/in-demand-occupations">In - Demand Occupations</LinkObject> List
                  may be eligible for funding. Contact your local One-Stop Career Center for more
                  information regarding program and training availability.
                </p>
                <a
                  href="https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?location=New%20Jersey&amp;radius=0&amp;source=NLX&amp;currentpage=1"
                  className="usa-button usa-button--outline"
                >
                  Contact Career One-Stop
                  <ArrowRight size={22} />
                </a>
              </FundingBox>
            )}
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
