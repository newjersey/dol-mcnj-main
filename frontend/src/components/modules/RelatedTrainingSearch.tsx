import { CircularProgress } from "@material-ui/core";
import { GraduationCap, Hourglass, MapPinLine, Warning } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Client } from "../../domain/Client";
import { TrainingResult } from "../../domain/Training";
import { toUsCurrency } from "../../utils/toUsCurrency";
import { calendarLength } from "../../utils/calendarLength";

export const RelatedTrainingSearch = ({ query, client }: { query: string; client: Client }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [trainings, setTrainings] = useState<TrainingResult[]>([]);

  useEffect(() => {
    client.getTrainingsByQuery(query, {
      onSuccess: (data: TrainingResult[]) => {
        setTrainings(data);
        setLoading(false);
      },
      onError: () => {
        setIsError(true);
      },
    });
  }, [query]);
  return (
    <>
      {loading ? (
        <div className="loading fdr fjc fac ptm pbl">
          <CircularProgress color="secondary" />
        </div>
      ) : isError ? (
        <div className="error">
          <Warning size={32} />
          <p>
            We are having trouble loading the related training opportunities. Please try again
            later.
          </p>
        </div>
      ) : (
        <>
          {trainings?.slice(0, 3).map((train) => (
            <li key={train.id}>
              <a href={`/training/${train.id}`} target="_blank" rel="noopener noreferrer">
                <p className="title">{train.name}</p>
                <span className="span-grid">
                  <span>
                    <GraduationCap size={32} />
                    {train.providerName}
                  </span>
                  <span>
                    <MapPinLine size={32} />
                    {train.city}, {train.county}
                  </span>
                  <span className="last-line">
                    <span>
                      <Hourglass size={32} />
                      {train.calendarLength
                        ? `${calendarLength(train.calendarLength)} to complete`
                        : "--"}
                    </span>

                    {train.totalCost !== 0 && (
                      <span className="salary">{toUsCurrency(train.totalCost)}</span>
                    )}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </>
      )}
    </>
  );
};
