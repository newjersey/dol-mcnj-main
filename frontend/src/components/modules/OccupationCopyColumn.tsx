import { OccupationNodeProps } from "../../types/contentful";
import { parseMarkdownToHTML } from "../../utils/parseMarkdownToHTML";
import { IconSelector } from "../IconSelector";

type ContentMapping = {
  [key in keyof OccupationNodeProps]?: {
    title: string;
    icon: string;
  };
};

export const OccupationCopyColumn = (props: OccupationNodeProps) => {
  const contentMapping: ContentMapping = {
    tasks: { title: "What do they do?", icon: "Briefcase" },
    education: { title: "Education", icon: "GraduationCap" },
    skills: { title: "Skills Needed", icon: "SealCheck" },
    experience: { title: "Other Experience", icon: "ReadCvLogo" },
    advancement: { title: "How to move up", icon: "TrendUp" },
  };

  const blockArray = Object.entries(contentMapping)
    .filter(([key]) => props[key as keyof OccupationNodeProps])
    .map(([key, { title, icon }]) => ({
      title,
      content: props[key as keyof OccupationNodeProps],
      icon,
    }));

  return (
    <>
      {blockArray.map(({ title, icon, content }, index) => (
        <div className="box" key={index + title}>
          <div className="heading-bar">
            <IconSelector name={icon} size={32} />
            {title}
          </div>
          {content && (
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHTML(`${content}`),
              }}
            />
          )}
        </div>
      ))}
    </>
  );
};
