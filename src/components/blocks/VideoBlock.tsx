"use client";
import { Button } from "@components/modules/Button";
import { YoutubeLogo } from "@phosphor-icons/react";
import { colors } from "@utils/settings";

interface VideoBlockProps {
  className?: string;
  video: string;
}

const VideoBlock = ({ className, video }: VideoBlockProps) => {
  return (
    <section
      className={`videoBlock${className ? ` ${className}` : ""} container`}
    >
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
      </div>
      <div className="link">
        <Button
          type="link"
          defaultStyle="secondary"
          link={`https://www.youtube.com/watch?v=${
            video.split("/").slice(-1)[0]
          }`}
        >
          <YoutubeLogo size={24} color={colors.white} />
          Video Demo
        </Button>
      </div>
    </section>
  );
};

export { VideoBlock };
