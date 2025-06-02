import { IconSelector } from "./IconSelector";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HeroBanner = ({
  eyebrow,
  heading,
  subheading,
  message,
  image,
  theme = "blue",
  buttons,
}: {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  message?: string;
  image?: string;
  theme?: "blue" | "green" | "purple" | "navy";
  buttons?: {
    text: string;
    href: string;
    onClick?: () => void;
    icon?: string;
  }[];
}) => {
  return (
    <section className={`heroBanner${theme ? ` theme-${theme}` : ""}`}>
      <div className="container">
        <div className="inner">
          <div className="copy">
            {eyebrow && <h1 className="eyebrow">{eyebrow}</h1>}
            {heading && <h2 className="heading-tag">{heading}</h2>}
            {subheading && <p className="subheading">{subheading}</p>}
            {message && <p className="message">{message}</p>}
            {buttons && (
              <div className="buttons">
                {buttons.map((button, index) => {
                  if (button.onClick) {
                    return (
                      <button
                        key={index}
                        className={`usa-button${index > 0 ? " usa-button--outline" : ""}`}
                        onClick={button.onClick}
                      >
                        {button.text}
                        {button.icon && <IconSelector name={button.icon} color="white" size={24} />}
                      </button>
                    );
                  }
                  return (
                    <a
                      key={index}
                      className={`usa-button${index > 0 ? " usa-button--outline" : ""}`}
                      href={button.href}
                    >
                      {button.text}
                      {button.icon && <IconSelector name={button.icon} color="white" size={24} />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          {image && (
            <div className="image">
              <img src={image} alt="" loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
