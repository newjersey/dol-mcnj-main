import { Button } from "@components/modules/Button";
import { LabelBox } from "@components/modules/LabelBox";
import { LinkObject } from "@components/modules/LinkObject";
import { Box } from "@components/utility/Box";
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
          <Button
            type="button"
            className="under-dash"
            unstyled
            onClick={(e) => {
              e.preventDefault();
              setCipDrawerOpen(!cipDrawerOpen);
            }}
          >
            Classification of Instructional Programs
          </Button>
          <Box className="indent">
            <p>
              <LinkObject
                url={`https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cip=${formatCip(
                  training.cipDefinition?.cipcode
                )}`}
              >
                {`${training.cipDefinition?.ciptitle} (${formatCip(
                  training.cipDefinition?.cipcode
                )})`}
              </LinkObject>
            </p>
          </Box>
        </LabelBox>
      )}
    </>
  );
};
