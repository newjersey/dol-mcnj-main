import { Request, Response, Router } from "express";
import {
  FindTrainingsBy,
  GetInDemandOccupations,
  SearchTrainings,
  GetOccupationDetail,
  GetOccupationDetailByCIP,
} from "../domain/types";
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

  router.get("/trainings/search", (req: Request, res: Response<TrainingResult[] | { error: string }>) => {
    searchTrainings(req.query.query as string)
        .then((trainings: TrainingResult[]) => {
          console.log(`Successfully retrieved training programs: `, trainings);
          res.status(200).json(trainings);
        })
        .catch((error: unknown) => {
          console.error(`Error caught in catch block:`, error);
          return res.status(500).json({ error: 'Internal server error' });

        });
  });

  router.get("/trainings/:id", (req: Request, res: Response<Training>) => {
    findTrainingsBy(Selector.ID, [req.params.id as string])
      .then((trainings: Training[]) => {
        if (trainings.length === 0) {
          throw new Error('NOT_FOUND')
        }
        res.status(200).json(trainings[0]);
      })
        .catch((e) => {
          if (e?.message === "NOT_FOUND") {
            res.status(404).send();
          }
          else {
            res.status(500).send();
          }
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
        const sanitizedTerm = encodeURIComponent(req.params.term || "");
        console.log(`[jobcount] Request for: ${sanitizedTerm}`);
        // Print the env vars to make sure they're loaded
        console.log('CAREER_ONESTOP_BASEURL:', process.env.CAREER_ONESTOP_BASEURL);
        console.log('CAREER_ONESTOP_USERID:', process.env.CAREER_ONESTOP_USERID);
        console.log('CAREER_ONESTOP_AUTH_TOKEN:', process.env.CAREER_ONESTOP_AUTH_TOKEN?.slice(0,5) + '...');
        const countData = await CareerOneStopClient(
            process.env.CAREER_ONESTOP_BASEURL as string,
            process.env.CAREER_ONESTOP_USERID as string,
            process.env.CAREER_ONESTOP_AUTH_TOKEN as string,
        )(sanitizedTerm);
        console.log(`[jobcount] Upstream returned: ${countData}`);
        res.status(200).json({ count: countData || 0 });
    });

  router.get("/occupations/cip/:cip", (req: Request, res: Response<OccupationDetail[]>) => {
    getOccupationDetailByCIP(req.params.cip as string)
      .then((occupationDetails: OccupationDetail[]) => {
        res.status(200).json(occupationDetails);
      })
      .catch(() => res.status(500).send());
  });

  return router;
};
