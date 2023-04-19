import { FinResourceItemProps } from "../types/contentful";
import { ContentfulRichText } from "./ContentfulRichText";
import { LinkObject } from "./modules/LinkObject";

export const FinancialResource = ({
  details,
  link,
  taggedCatsCollection,
  title,
}: FinResourceItemProps) => {
  return (
    <div className="financial-resource">
      <p className="heading">{title}</p>
      <ContentfulRichText document={details.json} className="details" />
      <div className="tags">
        {taggedCatsCollection.items.map((tag) => (
          <span className={`usa-tag usa-tag--big ${tag.color}`} key={tag.sys?.id}>
            {tag.title}
          </span>
        ))}
      </div>
      <LinkObject className="link" url={link} icons>
        Visit Website
      </LinkObject>
    </div>
  );
};
