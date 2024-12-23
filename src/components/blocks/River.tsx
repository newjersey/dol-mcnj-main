import { Heading } from "@components/modules/Heading";
import { Markdown } from "@components/modules/Markdown";
import { ResponsiveImage } from "@components/modules/ResponsiveImage";
import { noOrphans } from "@utils/noOrphans";
import { HeadingLevel, RiverItemProps } from "@utils/types";

export interface RiverProps {
  className?: string;
  headingLevel?: HeadingLevel;
  items: RiverItemProps[];
}

const River = ({ className, items, headingLevel = 2 }: RiverProps) => {
  return (
    <section className={`river${className ? ` ${className}` : ""}`}>
      <div className="container">
        {items.map((item, index) => (
          <div className="item" key={item.heading + index}>
            {item.image && (
              <div className="image">
                <ResponsiveImage
                  src={item.image.url}
                  alt=""
                  isBackground
                  height={item.image.height}
                  width={item.image.width}
                />
              </div>
            )}

            <div className="content">
              {item.heading && (
                <Heading level={headingLevel} className="heading">
                  {noOrphans(item.heading)}
                </Heading>
              )}
              {item.copy && <Markdown className="copy" content={item.copy} />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { River };
