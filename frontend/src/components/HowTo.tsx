import { YoutubeLogo } from "@phosphor-icons/react";
import { IconNames } from "../types/icons";
import { Stepper } from "./Stepper";
import { SectionHeading } from "./modules/SectionHeading";

interface HowToProps {
  header: string;
  video: string;
  steps: {
    heading: string;
    icon: IconNames;
    description: string;
  }[];
}

export const HowTo = (props: HowToProps) => {
  const { header, video, steps } = props;
  return (
    <section className="how-to">
      <div className="container">
        <SectionHeading heading={header} headingLevel={3} />
        <div className="video">
          <div className="player">
            <div className="embed-youtube">
              <iframe
                src={video}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${video.split("/").slice(-1)[0]}`}
            target="_blank"
            rel="noreferrer noopener"
            className="usa-button"
          >
            <YoutubeLogo color="#fff" size={24} />
            View Demo
          </a>
        </div>
        <Stepper steps={steps} />
      </div>
    </section>
  );
};
