import { Request, Response, Router } from "express";
import {
  FindTrainingsBy,
  GetInDemandOccupations,
  SearchTrainings,
  GetOccupationDetail,
  GetAllCertificates,
  GetOccupationDetailByCIP,
} from "../domain/types";
import { Occupation, OccupationDetail } from "../domain/occupations/Occupation";
import { Certificates } from "../domain/credentialengine/CredentialEngineInterface";
import { Training } from "../domain/training/Training";
import { TrainingData } from "../domain/training/TrainingResult";
import { Selector } from "../domain/training/Selector";
import { CareerOneStopClient } from "../careeronestop/CareerOneStopClient";

interface RouterActions {
  searchTrainings: SearchTrainings;
  findTrainingsBy: FindTrainingsBy;
  getInDemandOccupations: GetInDemandOccupations;
  getOccupationDetail: GetOccupationDetail;
  getAllCertificates: GetAllCertificates;
  getOccupationDetailByCIP: GetOccupationDetailByCIP;
}

export const routerFactory = ({
  searchTrainings,
  findTrainingsBy,
  getInDemandOccupations,
  getOccupationDetail,
  getAllCertificates,
  getOccupationDetailByCIP,
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
        req.params.cancel as unknown as boolean,
      )
        .then((certificates: Certificates) => {
          res.status(200).json(certificates);
        })
        .catch((e) => res.status(500).send(e));
    },
  );

  router.get("/trainings/search", (req: Request, res: Response<TrainingData>) => {
    let page = parseInt(req.query.page as string);
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    let limit = parseInt(req.query.limit as string);
    if (isNaN(limit) || limit < 1) {
      limit = 10;
    }
    
    searchTrainings({
      searchQuery: req.query.query as string,
      page: page,
      limit: limit,
      sort: req.query.sort as string,
      county: req.query.county as string,
      maxCost: parseInt(req.query.maxCost as string),
      miles: parseInt(req.query.miles as string),
      zipcode: req.query.zipcode as string,
    })
      .then((trainings: TrainingData) => {
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
        if (e.message === "Not Found") {
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

  router.get("/jobcount/:term", async (req: Request, res: Response<{ count: number }>) => {
    // Sanitize and encode the user input before using it in the URL
    const sanitizedTerm = encodeURIComponent(req.params.term || "");

    // Use the sanitized input in the URL
    const countData = await CareerOneStopClient(
      process.env.CAREER_ONESTOP_BASEURL as string,
      process.env.CAREER_ONESTOP_USERID as string,
      process.env.CAREER_ONESTOP_AUTH_TOKEN as string,
    )(sanitizedTerm);

    res.status(200).json({ count: countData || 0 });
  });

  router.get("/occupations/cip/:cip", (req: Request, res: Response<OccupationDetail[]>) => {
    // console.log("here");
    getOccupationDetailByCIP(req.params.cip as string)
      .then((occupationDetails: OccupationDetail[]) => {
        res.status(200).json(occupationDetails);
      })
      .catch(() => res.status(500).send());
  });

  return router;
};
