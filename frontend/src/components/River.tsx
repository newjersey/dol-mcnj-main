import { HeadingLevel, ImageProps } from "../types/contentful";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";
import { Heading } from "./modules/Heading";

interface RiverProps {
  className?: string;
  headingsLevel?: HeadingLevel;
  items: {
    sys: {
      id: string;
    };
    copy?: string;
    heading?: string;
    image: ImageProps;
  }[];
}

const River = ({ className, items, headingsLevel = 3 }: RiverProps) => {
  return (
    <section className={`river${className ? ` ${className}` : ""}`}>
      <div className="container">
        {items.map((item) => (
          <div className="item" key={item.sys.id}>
            <div className="image">
              <img
                src={item.image.url}
                alt=""
                height={item.image.height}
                width={item.image.width}
              />
            </div>
            <div className="content">
              {item.heading && (
                <Heading className="heading" level={headingsLevel}>
                  {item.heading}
                </Heading>
              )}

              {item.copy && (
                <div
                  className="copy"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownToHTML(item.copy),
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { River };
