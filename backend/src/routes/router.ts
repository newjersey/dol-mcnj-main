import { Request, Response, Router } from "express";
import {
  FindTrainingsBy,
  GetInDemandOccupations,
  SearchTrainings,
  GetOccupationDetail,
  GetContentfulFAQ,
  GetContentfulTPR,
  GetContentfulGNav,
  GetContentfulMNav,
  GetContentfulFootNav,
  GetContentfulFootNav2,
} from "../domain/types";
import { Error } from "../domain/Error";
import { Occupation, OccupationDetail } from "../domain/occupations/Occupation";
import { Training } from "../domain/training/Training";
import { TrainingResult } from "../domain/training/TrainingResult";
import { Selector } from "../domain/training/Selector";
import { FaqPageProps, NavMenuProps, TrainingProviderPageProps } from "src/domain/contentful/types";

interface RouterActions {
  searchTrainings: SearchTrainings;
  findTrainingsBy: FindTrainingsBy;
  getInDemandOccupations: GetInDemandOccupations;
  getOccupationDetail: GetOccupationDetail;
  getContentfulFAQ: GetContentfulFAQ;
  getContentfulTPR: GetContentfulTPR;
  getContentfulGNav: GetContentfulGNav;
  getContentfulMNav: GetContentfulMNav;
  getContentfulFootNav: GetContentfulFootNav;
  getContentfulFootNav2: GetContentfulFootNav2;
}

export const routerFactory = ({
  searchTrainings,
  findTrainingsBy,
  getInDemandOccupations,
  getOccupationDetail,
  getContentfulFAQ,
  getContentfulTPR,
  getContentfulGNav,
  getContentfulMNav,
  getContentfulFootNav,
  getContentfulFootNav2,
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
    findTrainingsBy(Selector.ID, [req.params.id as string])
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

  router.get("/occupations/:soc", (req: Request, res: Response<OccupationDetail>) => {
    getOccupationDetail(req.params.soc as string)
      .then((occupationDetail: OccupationDetail) => {
        res.status(200).json(occupationDetail);
      })
      .catch(() => res.status(500).send());
  });

  router.get("/contentful/gnav", async (req: Request, res: Response<NavMenuProps>) => {
    getContentfulGNav(req.params.query as string)
      .then((content: NavMenuProps) => {
        res.status(200).json(content);
      })
      .catch((e) => res.status(500).send(e));
  });
  router.get("/contentful/mnav", async (req: Request, res: Response<NavMenuProps>) => {
    getContentfulMNav(req.params.query as string)
      .then((content: NavMenuProps) => {
        res.status(200).json(content);
      })
      .catch((e) => res.status(500).send(e));
  });
  router.get("/contentful/footNav", async (req: Request, res: Response<NavMenuProps>) => {
    getContentfulFootNav(req.params.query as string)
      .then((content: NavMenuProps) => {
        res.status(200).json(content);
      })
      .catch((e) => res.status(500).send(e));
  });
  router.get("/contentful/footNav2", async (req: Request, res: Response<NavMenuProps>) => {
    getContentfulFootNav2(req.params.query as string)
      .then((content: NavMenuProps) => {
        res.status(200).json(content);
      })
      .catch((e) => res.status(500).send(e));
  });

  router.get("/contentful/faq", async (req: Request, res: Response<FaqPageProps>) => {
    getContentfulFAQ(req.params.query as string)
      .then((content: FaqPageProps) => {
        res.status(200).json(content);
      })
      .catch((e) => res.status(500).send(e));
  });

  router.get("/contentful/tpr", async (req: Request, res: Response<TrainingProviderPageProps>) => {
    getContentfulTPR(req.params.query as string)
      .then((content: TrainingProviderPageProps) => {
        res.status(200).json(content);
      })
      .catch((e) => res.status(500).send(e));
  });

  return router;
};
