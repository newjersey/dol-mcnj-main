import { Request, Response, Router } from "express";
import {
  FindTrainingsBy,
  GetInDemandOccupations,
  SearchTrainings,
  GetOccupationDetail,
} from "../domain/types";
import { Error } from "../domain/Error";
import { Occupation, OccupationDetail } from "../domain/occupations/Occupation";
import { Training } from "../domain/training/Training";
import { TrainingResult } from "../domain/training/TrainingResult";
import { Selector } from "../domain/training/Selector";
import { getOccupationDetailFactory } from "src/domain/occupations/getOccupationDetail";
import { CareerOneStopClient } from "src/careeronestop/CareerOneStopClient";

interface RouterActions {
  searchTrainings: SearchTrainings;
  findTrainingsBy: FindTrainingsBy;
  getInDemandOccupations: GetInDemandOccupations;
  getOccupationDetail: GetOccupationDetail;
}

export const routerFactory = ({
  searchTrainings,
  findTrainingsBy,
  getInDemandOccupations,
  getOccupationDetail,
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

  router.get("/jobcount/:term", async (req: Request, res: Response<any>) => {
    const data = await fetch(
      `${process.env.CAREER_ONESTOP_BASEURL}/v1/jobsearch/${process.env.CAREER_ONESTOP_USERID}/${req.params.term}/NJ/1000/0/0/0/10/0?source=NLx&showFilters=false`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CAREER_ONESTOP_AUTH_TOKEN}`,
        },
      },
    );

    const { Jobcount } = await data.json();

    res.status(200).json({ count: Math.floor(parseInt(Jobcount)) });
  });

  return router;
};
