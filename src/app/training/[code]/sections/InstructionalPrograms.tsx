import { LabelBox } from "@components/modules/LabelBox";
import { Box } from "@components/utility/Box";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { formatCip } from "@utils/formatCip";
import { TrainingProps } from "@utils/types";

export const InstructionalPrograms = ({
  training,
  setCipDrawerOpen,
  cipDrawerOpen,
}: {
  training: TrainingProps;
  setCipDrawerOpen: (value: boolean) => void;
  cipDrawerOpen: boolean;
}) => {
  return (
    <>
      {training.cipDefinition && (
        <LabelBox
          large
          title="Instructional Programs"
          color="green"
          className="cip"
          subheading="Type of material covered by the Learning Opportunity"
        >
          <button
            type="button"
            className="under-dash"
            onClick={(e) => {
              e.preventDefault();
              setCipDrawerOpen(!cipDrawerOpen);
            }}
          >
            <span>Classification of Instructional Programs</span>
          </button>

          <Box className="indent">
            <p>
              <a
                href={`https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cip=${formatCip(
                  training.cipDefinition?.cipcode
                )}`}
                className="flex items-center gap-2"
              >
                {`${training.cipDefinition?.ciptitle.replace(
                  /\.$/,
                  ""
                )} (${formatCip(training.cipDefinition?.cipcode)})`}
                <ArrowSquareOut size={20} />
              </a>
            </p>
          </Box>
        </LabelBox>
      )}
    </>
  );
};
