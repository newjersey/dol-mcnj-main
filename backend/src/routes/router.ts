import { Request, Response, Router } from "express";
import { DataClient } from "../domain/DataClient";
import { Program } from "../domain/Program";

export const routerFactory = (dataClient: DataClient): Router => {
  const router = Router();

  router.get("/programs/search", (req: Request, res: Response<Program[]>) => {
    (req.query.query
      ? dataClient.searchPrograms(req.query.query as string)
      : dataClient.findAllPrograms()
    )
      .then((programs: Program[]) => {
        res.status(200).json(programs);
      })
      .catch((e) => res.status(500).send(e));
  });

  router.get("/programs", (req: Request, res: Response<Program[]>) => {
    dataClient
      .findAllPrograms()
      .then((programs: Program[]) => {
        res.status(200).json(programs);
      })
      .catch((e) => res.status(500).send(e));
  });

  return router;
};
