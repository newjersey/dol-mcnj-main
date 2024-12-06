import { Button } from "@components/modules/Button";
import { LabelBox } from "@components/modules/LabelBox";
import { LinkObject } from "@components/modules/LinkObject";
import { Box } from "@components/utility/Box";
import { TrainingProps } from "@utils/types";

export const AssociatedOccupationsIndustries = ({
  training,
  setSocDrawerOpen,
  socDrawerOpen,
}: {
  training: TrainingProps;
  setSocDrawerOpen: (value: boolean) => void;
  socDrawerOpen: boolean;
}) => {
  return (
    <LabelBox
      large
      subheading="Explore the occupations below to learn more"
      color="green"
      title="Associated Occupations and Industries"
      className="occupations"
    >
      <Button
        type="button"
        className="under-dash"
        unstyled
        onClick={(e) => {
          e.preventDefault();
          setSocDrawerOpen(!socDrawerOpen);
        }}
      >
        Standard Occupational Classification
      </Button>
      <Box className="indent">
        {training.occupations?.map((occupation: any) => (
          <LinkObject
            key={occupation.soc}
            target="_blank"
            url={`/occupation/${occupation.soc}`}
          >
            {occupation.title}
          </LinkObject>
        ))}
      </Box>
    </LabelBox>
  );
};
