import {
  GraduationCap,
  Hourglass,
  MapPinLine,
} from "@phosphor-icons/react/dist/ssr";
import { calendarLength } from "@utils/calendarLength";
import { toUsCurrency } from "@utils/toUsCurrency";
import { TrainingResult } from "@utils/types";

export const RelatedTrainingCard = (trainingItem: TrainingResult) => {
  return (
    <li>
      <a
        href={`/training/${trainingItem.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="title-bar">{trainingItem.name}</p>
        <span className="span-grid">
          <span>
            <GraduationCap size={32} />
            {trainingItem.providerName}
          </span>
          <span>
            <MapPinLine size={32} />
            {trainingItem.city}, {trainingItem.county}
          </span>
          <span className="last-line">
            <span>
              <Hourglass size={32} />
              {trainingItem.calendarLength
                ? `${calendarLength(trainingItem.calendarLength)} to complete`
                : "--"}
            </span>
            <span className="salary">
              {trainingItem.totalCost && toUsCurrency(trainingItem.totalCost)}
            </span>
          </span>
        </span>
      </a>
    </li>
  );
};
