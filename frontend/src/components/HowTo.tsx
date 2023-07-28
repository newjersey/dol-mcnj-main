import { YoutubeLogo } from "@phosphor-icons/react";
import { IconNames } from "../types/icons";
import { Stepper } from "./Stepper";

interface HowToProps {
  header: string;
  video: string;
  steps: {
    header: string;
    icon: IconNames;
    text: string;
  }[];
}

export const HowTo = (props: HowToProps) => {
  const { header, video, steps } = props;
  return (
    <section className="how-to">
      <div className="container">
        <h3>{header}</h3>
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
