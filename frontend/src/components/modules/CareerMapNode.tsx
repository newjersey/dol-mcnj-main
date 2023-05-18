import { CareerMapNodeProps } from "../../types/contentful";
import { numberShorthand } from "../../utils/numberShorthand";
import { EducationLevel } from "./EducationLevel";

export const CareerMapNode = (props: CareerMapNodeProps) => {
  return (
    <li className={`level-${props.level}`}>
      <div className="info" id={props?.sys?.id}>
        <div className="box">
          <div className="inner">
            <strong>{props.shortTitle || props.title}</strong>
            <br />
            <p>
              <strong>Salary:</strong> ${numberShorthand(props.salaryRangeStart)} - $
              {numberShorthand(props.salaryRangeEnd)}
            </p>
            <p>
              <strong>Education:</strong> <EducationLevel level={props.educationLevel} />
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};
