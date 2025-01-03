import { CostTable } from "@components/modules/CostTable";
import { LabelBox } from "@components/modules/LabelBox";
import { TrainingProps } from "@utils/types";

export const Cost = ({
  training,
  mobileOnly,
  desktopOnly,
}: {
  training: TrainingProps;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}) => {
  return (
    <LabelBox
      large
      color="green"
      title="Cost"
      className={`cost${mobileOnly ? " mobile-only" : ""}${
        desktopOnly ? " desktop-only" : ""
      }`}
      subheading="Detailed cost breakdown of the Learning Opportunity"
    >
      <CostTable
        items={[
          {
            cost: training.tuitionCost,
            title: "Tuition",
          },
          {
            cost: training.feesCost,
            title: "Fees",
          },
          {
            cost: training.booksMaterialsCost,
            title: "Books & Materials",
          },
          {
            cost: training.suppliesToolsCost,
            title: "Supplies & Tools",
          },
          {
            cost: training.otherCost,
            title: "Other",
          },
        ]}
      />
    </LabelBox>
  );
};
