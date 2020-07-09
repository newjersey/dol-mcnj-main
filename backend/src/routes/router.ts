import { Request, Response, Router } from "express";
import { TrainingResult } from "../domain/Training";
import { SearchTrainings } from "../domain/types";

interface RouterActions {
  searchTrainings: SearchTrainings;
}

export const routerFactory = ({ searchTrainings }: RouterActions): Router => {
  const router = Router();

  router.get("/trainings/search", (req: Request, res: Response<TrainingResult[]>) => {
    searchTrainings(req.query.query as string)
      .then((trainings: TrainingResult[]) => {
        res.status(200).json(trainings);
      })
      .catch((e) => res.status(500).send(e));
  });

  return router;
};
