import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Heading } from "@components/modules/Heading";
import { Tag, TagItemProps } from "@components/modules/Tag";
import { Flex } from "@components/utility/Flex";
import { LinkProps } from "@utils/types";

interface MinimalBannerProps {
  crumbs?: {
    items: LinkProps[];
    pageTitle: string;
  };
  heading: string;
  description?: string;
  tag?: TagItemProps & {
    tooltip?: string;
  };
}

export const MinimalBanner = ({
  crumbs,
  heading,
  description,
  tag,
}: MinimalBannerProps) => {
  return (
    <section className="minimalBanner">
      <div className="container">
        <Flex direction="column" gap="xl">
          {crumbs && (
            <Breadcrumbs crumbs={crumbs.items} pageTitle={crumbs.pageTitle} />
          )}
          <Flex direction="column" gap="xxs">
            <span>
              <Heading level={1}>{heading}</Heading>
              {tag && <Tag {...tag} small />}
            </span>
            {description && <p className="lrg-txt">{description}</p>}
          </Flex>
        </Flex>
      </div>
    </section>
  );
};
