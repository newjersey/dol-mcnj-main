import { Request, Response, Router } from "express";
import { DataClient } from "../domain/DataClient";

export const routerFactory = (dataClient: DataClient): Router => {
  const router = Router();

  router.get("/programs", (req: Request, res: Response<string[]>) => {
    dataClient
      .findAllPrograms()
      .then((programs: string[]) => {
        res.status(200).json(programs);
      })
      .catch((e) => res.status(500).send(e));
  });

  return router;
};
