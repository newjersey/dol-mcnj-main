import { Request, Response, Router } from "express";
import { Program } from "../domain/Program";
import { FindAllPrograms } from "../domain/types";
import { SearchPrograms } from "../domain/types";

interface RouterActions {
  findAllPrograms: FindAllPrograms;
  searchPrograms: SearchPrograms;
}

export const routerFactory = ({ findAllPrograms, searchPrograms }: RouterActions): Router => {
  const router = Router();

  router.get("/programs/search", (req: Request, res: Response<Program[]>) => {
    (req.query.query ? searchPrograms(req.query.query as string) : findAllPrograms())
      .then((programs: Program[]) => {
        res.status(200).json(programs);
      })
      .catch((e) => res.status(500).send(e));
  });

  router.get("/programs", (req: Request, res: Response<Program[]>) => {
    findAllPrograms()
      .then((programs: Program[]) => {
        res.status(200).json(programs);
      })
      .catch((e) => res.status(500).send(e));
  });

  return router;
};
