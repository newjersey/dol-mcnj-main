import { IntroBlocksProps } from "../types/contentful";

const IntroBlocks = ({ heading, message, sectionsHeading, sections }: IntroBlocksProps) => {
  return (
    <section className="introBlocks">
      <div className="heading-box box">
        <div className="inner">
          {heading && <h2>{heading}</h2>}
          {message && <p>{message}</p>}
        </div>
      </div>
      <div className="sections-box box">
        <div className="inner">{sectionsHeading && <h2>{sectionsHeading}</h2>}</div>
      </div>
    </section>
  );
};

export { IntroBlocks };
