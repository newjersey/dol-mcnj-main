import { IconSelector } from "./IconSelector";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HeroBanner = ({
  buttons,
  eyebrow,
  heading,
  image,
  message,
  steps,
  subheading,
  theme = "blue",
}: {
  buttons?: {
    text: string;
    href: string;
    onClick?: () => void;
    icon?: string;
  }[];
  eyebrow?: string;
  heading?: string;
  image?: string;
  message?: string;
  steps?: string[];
  subheading?: string;
  theme?: "blue" | "green" | "purple" | "navy";
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
        {steps && (
          <div className="steps">
            <ol className="unstyled">
              {steps.map((step, index) => (
                <li key={step}>
                  <div className="list-num-container">
                    <div className="list-num">{index + 1}</div>
                  </div>
                  <div className="list-info">
                    <p>{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};
