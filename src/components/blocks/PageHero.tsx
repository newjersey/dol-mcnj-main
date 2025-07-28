import { Alert } from "@components/modules/Alert";
import { Button } from "@components/modules/Button";
import { Heading } from "@components/modules/Heading";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { ButtonProps, ThemeColors } from "@utils/types";
import Image, { ImageProps } from "next/image";

export interface PageHeroProps {
  className?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  theme?: ThemeColors;
  ctaButtons?: ButtonProps[];
  button?: ButtonProps;
  image?: ImageProps;
  infoBar?:
    | {
        heading?: string;
        text: string;
        type?: "error" | "warning" | "info" | "success";
      }
    | string;
}

export const PageHero = (props: PageHeroProps) => {
  return (
    <div
      className={`pageHero${props.className ? ` ${props.className}` : ""}${
        props.theme ? ` ${props.theme}` : ""
      }`}
    >
      <div className="container">
        <div className="inner">
          <div className="heroContent">
            <Heading level={1}>{props.heading}</Heading>
            {props.subheading && (
              <p className="subheading">{props.subheading}</p>
            )}
            {props.ctaButtons && (
              <div className="buttons">
                {props.ctaButtons.map((button, index) => (
                  <Button key={`heroButton` + index} {...button} />
                ))}
              </div>
            )}
            {props.description && (
              <div
                className="description"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdownToHTML(props.description),
                }}
              />
            )}
            {props.button && (
              <div className="footer-button">
                <Button {...props.button} />
              </div>
            )}
            {props.infoBar && (
              <Alert
                className="max-w-[840px] rounded-[8px] overflow-hidden"
                heading={
                  typeof props.infoBar === "string"
                    ? undefined
                    : props.infoBar.heading || undefined
                }
                type={
                  typeof props.infoBar === "string"
                    ? "info"
                    : props.infoBar.type || "info"
                }
                copy={
                  typeof props.infoBar === "string"
                    ? props.infoBar
                    : props.infoBar.text
                }
              />
            )}
          </div>
          {props.image && (
            <div className="image">
              <Image {...props.image} alt="temp image" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
