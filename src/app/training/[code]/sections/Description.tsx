import { LabelBox } from "@components/modules/LabelBox";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { TrainingProps } from "@utils/types";

export const Description = ({ training }: { training: TrainingProps }) => {
  const desc = parseMarkdownToHTML(training.description);
  return (
    <LabelBox
      large
      subheading="About this Learning Opportunity"
      color="green"
      title="Description"
      headingLevel={2}
      className="description"
    >
      <div
        dangerouslySetInnerHTML={{
          __html: desc,
        }}
      />
    </LabelBox>
  );
};
