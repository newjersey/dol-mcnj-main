import { Request, Response, Router } from "express";
import { Training, TrainingResult } from "../domain/Training";
import { FindTrainingById, SearchTrainings } from "../domain/types";
import { Error } from "../domain/Error";

interface RouterActions {
  searchTrainings: SearchTrainings;
  findTrainingById: FindTrainingById;
}

export const routerFactory = ({ searchTrainings, findTrainingById }: RouterActions): Router => {
  const router = Router();

  router.get("/trainings/search", (req: Request, res: Response<TrainingResult[]>) => {
    searchTrainings(req.query.query as string)
      .then((trainings: TrainingResult[]) => {
        res.status(200).json(trainings);
      })
      .catch((e) => res.status(500).send(e));
  });

  router.get("/trainings/:id", (req: Request, res: Response<Training>) => {
    findTrainingById(req.params.id as string)
      .then((training: Training) => {
        res.status(200).json(training);
      })
      .catch((e) => {
        if (e === Error.NOT_FOUND) {
          res.status(404).send();
        }
        res.status(500).send();
      });
  });

  return router;
};
