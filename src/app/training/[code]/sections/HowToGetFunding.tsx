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
        className="font-bold underline underline-offset-[4px] decoration-[2px] flex items-center gap-2"
        href="https://www.nj.gov/labor/career-services/contact-us/one-stops/"
      >
        New Jersey&apos;s One-Stop Career Centers
        <ArrowSquareOut size={24} className="inline-block" />
      </Link>
      <p>You can also check out other tuition assistance opportunities.</p>
      <Link
        href="/support-resources/tuition-assistance"
        className="font-bold underline underline-offset-[4px] decoration-[2px]"
      >
        View Tuition Assistance Resource
      </Link>
    </LabelBox>
  );
};
