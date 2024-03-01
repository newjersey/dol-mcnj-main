import { Request, Response, Router } from "express";
import {
  FindTrainingsBy,
  GetInDemandOccupations,
  SearchTrainings,
  GetOccupationDetail,
  GetOccupationDetailByCIP,
} from "../domain/types";
import { Error } from "../domain/Error";
import { Occupation, OccupationDetail } from "../domain/occupations/Occupation";
import { Training } from "../domain/training/Training";
import { TrainingResult } from "../domain/training/TrainingResult";
import { Selector } from "../domain/training/Selector";
import { CareerOneStopClient } from "../careeronestop/CareerOneStopClient";

interface RouterActions {
  searchTrainings: SearchTrainings;
  findTrainingsBy: FindTrainingsBy;
  getInDemandOccupations: GetInDemandOccupations;
  getOccupationDetail: GetOccupationDetail;
  getOccupationDetailByCIP: GetOccupationDetailByCIP;
}

export const routerFactory = ({
  searchTrainings,
  findTrainingsBy,
  getInDemandOccupations,
  getOccupationDetail,
  getOccupationDetailByCIP,
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
    console.log("here");
    getOccupationDetailByCIP(req.params.cip as string)
      .then((occupationDetails: OccupationDetail[]) => {
        res.status(200).json(occupationDetails);
      })
      .catch(() => res.status(500).send());
  });

  return router;
};
