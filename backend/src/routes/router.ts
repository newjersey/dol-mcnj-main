import { Request, Response, Router } from "express";
import { Training } from "../domain/Training";
import { FindAllTrainings } from "../domain/types";
import { SearchTrainings } from "../domain/types";

interface RouterActions {
  findAllTrainings: FindAllTrainings;
  searchTrainings: SearchTrainings;
}

export const routerFactory = ({ findAllTrainings, searchTrainings }: RouterActions): Router => {
  const router = Router();

  router.get("/trainings/search", (req: Request, res: Response<Training[]>) => {
    (req.query.query ? searchTrainings(req.query.query as string) : findAllTrainings())
      .then((trainings: Training[]) => {
        res.status(200).json(trainings);
      })
      .catch((e) => res.status(500).send(e));
  });

  router.get("/trainings", (req: Request, res: Response<Training[]>) => {
    findAllTrainings()
      .then((trainings: Training[]) => {
        res.status(200).json(trainings);
      })
      .catch((e) => res.status(500).send(e));
  });

  return router;
};
