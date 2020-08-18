import { Request, Response, Router } from "express";
import { FindTrainingsByIds, GetInDemandOccupations, SearchTrainings } from "../domain/types";
import { Error } from "../domain/Error";
import { Occupation } from "../domain/occupations/Occupation";
import { Training } from "../domain/training/Training";
import { TrainingResult } from "../domain/search/TrainingResult";

interface RouterActions {
  searchTrainings: SearchTrainings;
  findTrainingsByIds: FindTrainingsByIds;
  getInDemandOccupations: GetInDemandOccupations;
}

export const routerFactory = ({
  searchTrainings,
  findTrainingsByIds,
  getInDemandOccupations,
}: RouterActions): Router => {
  const router = Router();

  router.get("/trainings/search", (req: Request, res: Response<TrainingResult[]>) => {
    searchTrainings(req.query.query as string)
      .then((trainings: TrainingResult[]) => {
        res.status(200).json(trainings);
      })
      .catch((e) => res.status(500).send(e));
  });

  router.get("/trainings/:id", (req: Request, res: Response<Training>) => {
    findTrainingsByIds([req.params.id as string])
      .then((trainings: Training[]) => {
        res.status(200).json(trainings[0]);
      })
      .catch((e) => {
        if (e === Error.NOT_FOUND) {
          res.status(404).send();
        }
        res.status(500).send();
      });
  });

  router.get("/occupations", (req: Request, res: Response<Occupation[]>) => {
    getInDemandOccupations()
      .then((occupations: Occupation[]) => {
        res.status(200).json(occupations);
      })
      .catch((e) => res.status(500).send(e));
  });

  return router;
};
