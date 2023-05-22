import { Certificate, GraduationCap, ReadCvLogo, SealCheck } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";

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
          <div className="content">
            <ReactMarkdown>{`${education}`}</ReactMarkdown>
          </div>
        </div>
      )}
      {credentials && (
        <div className="box">
          <div className="heading-bar">
            <Certificate size={25} />
            Credentials
          </div>
          <div className="content">
            <ReactMarkdown>{`${credentials}`}</ReactMarkdown>
          </div>
        </div>
      )}
      {skills && (
        <div className="box">
          <div className="heading-bar">
            <SealCheck size={25} />
            Skills
          </div>
          <div className="content">
            <ReactMarkdown>{`${skills}`}</ReactMarkdown>
          </div>
        </div>
      )}
      {experience && (
        <div className="box">
          <div className="heading-bar">
            <ReadCvLogo size={25} />
            Experience
          </div>
          <div className="content">
            <ReactMarkdown>{`${experience}`}</ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
};
