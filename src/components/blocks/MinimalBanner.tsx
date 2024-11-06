import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Heading } from "@components/modules/Heading";
import { Tag, TagItemProps } from "@components/modules/Tag";
import { IconNames } from "@utils/enums";
import { LinkProps, TagProps, ThemeColors } from "@utils/types";

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
    <div className="minimalBanner">
      <div className="container">
        {crumbs && (
          <Breadcrumbs crumbs={crumbs.items} pageTitle={crumbs.pageTitle} />
        )}
        <span>
          <Heading level={1}>{heading}</Heading>
          {tag && <Tag {...tag} small />}
        </span>
        {description && <p className="lrg-txt">{description}</p>}
      </div>
    </div>
  );
};
