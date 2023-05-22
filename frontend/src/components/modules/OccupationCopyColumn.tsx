import { Certificate, GraduationCap, ReadCvLogo, SealCheck } from "@phosphor-icons/react";
import { parseMarkdownToHTML } from "../../utils/parseMarkdownToHTML";

export const OccupationCopyColumn = ({
  education,
  credentials,
  skills,
  experience,
}: {
  education?: string;
  credentials?: string;
  skills?: string;
  experience?: string;
}) => {
  return (
    <>
      {education && (
        <div className="box">
          <div className="heading-bar">
            <GraduationCap size={25} />
            Education
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(education),
            }}
          />
        </div>
      )}
      {credentials && (
        <div className="box">
          <div className="heading-bar">
            <Certificate size={25} />
            Credentials
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(credentials),
            }}
          />
        </div>
      )}
      {skills && (
        <div className="box">
          <div className="heading-bar">
            <SealCheck size={25} />
            Skills
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(skills),
            }}
          />
        </div>
      )}
      {experience && (
        <div className="box">
          <div className="heading-bar">
            <ReadCvLogo size={25} />
            Experience
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(experience),
            }}
          />
        </div>
      )}
    </>
  );
};
