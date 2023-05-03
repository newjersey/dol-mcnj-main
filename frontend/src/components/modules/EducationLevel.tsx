import { GraduationCap } from "@phosphor-icons/react";

export const EducationLevel = ({ level }: { level: 1 | 2 | 3 | 4 }) => {
  return (
    <>
      <GraduationCap size={13} opacity={level >= 1 ? 1 : 0.5} />
      <GraduationCap size={13} opacity={level >= 2 ? 1 : 0.5} />
      <GraduationCap size={13} opacity={level >= 3 ? 1 : 0.5} />
      <GraduationCap size={13} opacity={level === 4 ? 1 : 0.5} />
    </>
  );
};
