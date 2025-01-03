import { Button } from "@components/modules/Button";
import { LabelBox } from "@components/modules/LabelBox";
import { LinkObject } from "@components/modules/LinkObject";
import { ArrowSquareOut } from "@phosphor-icons/react";
import Link from "next/link";

export const HowToGetFunding = ({
  mobileOnly,
  desktopOnly,
}: {
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}) => {
  return (
    <LabelBox
      large
      color="green"
      title="How to get funding"
      className={`funding${mobileOnly ? " mobile-only" : ""}${
        desktopOnly ? " desktop-only" : ""
      }`}
      subheading="You may be eligible for funding for certain training opportunities"
    >
      <p>
        Trainings related to occupations on the{" "}
        <LinkObject url="/in-demand-occupations">
          In - Demand Occupations List
        </LinkObject>{" "}
        may be eligible for funding. Contact your local One-Stop Career Center
        for more information regarding program and training availability.
      </p>
      <Link
        className="boldLink"
        href="https://www.nj.gov/labor/career-services/contact-us/one-stops/"
      >
        New Jersey&apos;s One-Stop Career Centers
        <ArrowSquareOut size={24} />
      </Link>
      <p>You can also check out other tuition assistance opportunities.</p>
      <Button
        unstyled
        newTab
        type="link"
        link="/support-resources/tuition-assistance"
      >
        View Tuition Assistance Resource
      </Button>
    </LabelBox>
  );
};
