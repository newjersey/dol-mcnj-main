import { highlighter } from "@utils/highlighter";
import { LinkObject } from "./LinkObject";
import { ResponsiveImage } from "./ResponsiveImage";
import { HeadingLevel } from "@utils/types";

interface MediaCardProps {
  className?: string;
  description?: string;
  headingLevel?: HeadingLevel;
  image?: {
    url: string;
    lqip?: string;
  };
  title: string;
  url?: string;
}

const Content = ({
  className,
  description,
  headingLevel = 3,
  image,
  title,
}: MediaCardProps) => {
  const Heading = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  return (
    <div className={`media-card${className ? ` ${className}` : ""}`}>
      {image && (
        <div className="image">
          <ResponsiveImage
            src={image.url}
            lqip={image.lqip}
            isBackground
            alt={`Image for "${title}"`}
          />
        </div>
      )}
      {title && (
        <Heading
          dangerouslySetInnerHTML={{
            __html: highlighter(title),
          }}
        />
      )}
      {description && (
        <p
          dangerouslySetInnerHTML={{
            __html: highlighter(description),
          }}
        />
      )}
      <span className="link">Read More</span>
    </div>
  );
};

const MediaCard = ({ image, title, description, url }: MediaCardProps) => {
  const cardProps = {
    image,
    title,
    description,
  };
  return url ? (
    <LinkObject url={url} className="media-card">
      <Content {...cardProps} />
      rwar
    </LinkObject>
  ) : (
    <div className="media-card">
      <Content {...cardProps} />
    </div>
  );
};

export { MediaCard };
