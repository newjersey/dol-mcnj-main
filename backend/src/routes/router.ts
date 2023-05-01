import { Request, Response, Router } from "express";
import {
  FindTrainingsBy,
  GetInDemandOccupations,
  SearchTrainings,
  GetOccupationDetail,
  GetAllCertificates,
  GetContentfulFAQ,
  GetContentfulTPR,
  GetContentfulFRP,
  GetContentfulGNav,
  GetContentfulMNav,
  GetContentfulFootNav,
  GetContentfulFootNav2,
  GetContentfulCPW,
} from "../domain/types";
import { Error } from "../domain/Error";
import { Occupation, OccupationDetail } from "../domain/occupations/Occupation";
import { Certificates } from "../domain/credentialengine/CredentialEngineInterface";
import { Training } from "../domain/training/Training";
import { TrainingResult } from "../domain/training/TrainingResult";
import { Selector } from "../domain/training/Selector";
import {
  FaqPageProps,
  FinancialResourcePageProps,
  TrainingProviderPageProps,
  NavMenuProps,
  CareerPathwaysPageProps,
} from "src/domain/contentful/types";

interface RouterActions {
  searchTrainings: SearchTrainings;
  findTrainingsBy: FindTrainingsBy;
  getInDemandOccupations: GetInDemandOccupations;
  getOccupationDetail: GetOccupationDetail;
  getAllCertificates: GetAllCertificates;
  getContentfulCPW: GetContentfulCPW;
  getContentfulFAQ: GetContentfulFAQ;
  getContentfulTPR: GetContentfulTPR;
  getContentfulFRP: GetContentfulFRP;
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
  getAllCertificates,
  getContentfulCPW,
  getContentfulFAQ,
  getContentfulTPR,
  getContentfulFRP,
  getContentfulGNav,
  getContentfulMNav,
  getContentfulFootNav,
  getContentfulFootNav2,
}: RouterActions): Router => {
  const router = Router();

  /**
   *
   */
  router.get(
    "/ce/getallcredentials/:skip/:take/:sort/:cancel",
    async (req: Request, res: Response<Certificates>) => {
      getAllCertificates(
        req.params.skip as unknown as number,
        req.params.take as unknown as number,
        req.params.sort as string,
        req.params.cancel as unknown as boolean
      )
        .then((certificates: Certificates) => {
          res.status(200).json(certificates);
        })
        .catch((e) => res.status(500).send(e));
    }
  );


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

  router.get(
    "/contentful/cpw/:industry",
    async (req: Request, res: Response<CareerPathwaysPageProps>) => {
      getContentfulCPW(req.params.query as string)
        .then((content: CareerPathwaysPageProps) => {
          res.status(200).json(content);
        })
        .catch((e) => res.status(500).send(e));
    }
  );

  router.get("/contentful/cpw", async (req: Request, res: Response<CareerPathwaysPageProps>) => {
    getContentfulCPW(req.params.query as string)
      .then((content: CareerPathwaysPageProps) => {
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

  router.get("/contentful/frp", async (req: Request, res: Response<FinancialResourcePageProps>) => {
    getContentfulFRP(req.params.query as string)
      .then((content: FinancialResourcePageProps) => {
        res.status(200).json(content);
      })
      .catch((e) => res.status(500).send(e));
  });

  return router;
};
