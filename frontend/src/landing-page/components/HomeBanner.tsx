import { ImageProps } from "../../types/contentful";

interface HomeBannerProps {
  heading: string;
  subheading?: string;
  image?: ImageProps;
  images?: string[];
  message?: string;
  preload?: boolean;
}

export const HomeBanner = ({ heading, subheading, images, message, preload }: HomeBannerProps) => {
  return (
    <section className="homeBanner">
      <div className="container">
        <div className="inner">
          <div className="copy">
            <h1>{heading}</h1>
            {subheading && <p className="subheading">{subheading}</p>}
            {message && <p>{message}</p>}
          </div>

          <div className="imageGrid">
            {images?.map((image, index) => (
              <div className="image" key={index}>
                <img src={image} alt="" loading={preload ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
