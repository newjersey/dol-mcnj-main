import { OccupationNodeProps } from "../../types/contentful";
import { CareerBox } from "./CareerBox";

export const OccupationCopyColumn = ({
  education,

  skills,
  tasks,
  experience,
  advancement,
}: OccupationNodeProps) => {
  const blockArray = [];

  if (tasks) {
    blockArray.push({
      title: " What do they do?",
      content: tasks,
      icon: "Briefcase",
    });
  }

  if (education) {
    blockArray.push({
      title: "Education",
      content: education,
      icon: "GraduationCap",
    });
  }

  if (skills) {
    blockArray.push({
      title: "Skills Needed",
      content: skills,
      icon: "SealCheck",
    });
  }

  if (experience) {
    blockArray.push({
      title: "Other Experience",
      content: experience,
      icon: "ReadCvLogo",
    });
  }

  if (advancement) {
    blockArray.push({
      title: "How to move up",
      content: advancement,
      icon: "TrendUp",
    });
  }

  return (
    <>
      {blockArray.map((block) => (
        <CareerBox title={block.title} content={block.content} icon={block.icon} />
      ))}
    </>
  );
};
