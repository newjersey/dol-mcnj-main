import {
  Briefcase,
  Certificate,
  GraduationCap,
  ReadCvLogo,
  SealCheck,
} from "@phosphor-icons/react";
import { parseMarkdownToHTML } from "../../utils/parseMarkdownToHTML";

export const OccupationCopyColumn = ({
  education,
  credentials,
  skills,
  tasks,
  experience,
}: {
  education?: string;
  credentials?: string;
  tasks?: string;
  skills?: string;
  experience?: string;
}) => {
  return (
    <>
      {tasks && (
        <div className="box">
          <div className="heading-bar">
            <Briefcase size={32} />
            What do they do?
          </div>

          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(tasks),
            }}
          />
        </div>
      )}
      {education && (
        <div className="box">
          <div className="heading-bar">
            <GraduationCap size={32} />
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
            <Certificate size={32} />
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
            <SealCheck size={32} />
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
            <ReadCvLogo size={32} />
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
