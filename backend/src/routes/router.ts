import { Request, Response, Router } from "express";
import { api } from '../credentialengine/CredentialEngineConfig';
import {
  FindTrainingsBy,
  GetInDemandOccupations,
  SearchTrainings,
  GetOccupationDetail,
  GetAllCertificates,
} from "../domain/types";
import { Error } from "../domain/Error";
import { Occupation, OccupationDetail } from "../domain/occupations/Occupation";
import { Certificates } from "../domain/credentialengine/CredentialEngine";
import { Training } from "../domain/training/Training";
import { TrainingResult } from "../domain/training/TrainingResult";
import { Selector } from "../domain/training/Selector";
import { AxiosResponse } from "axios";

interface RouterActions {
  searchTrainings: SearchTrainings;
  findTrainingsBy: FindTrainingsBy;
  getInDemandOccupations: GetInDemandOccupations;
  getOccupationDetail: GetOccupationDetail;
  getAllCertificates: GetAllCertificates;
}

export const routerFactory = ({
  searchTrainings,
  findTrainingsBy,
  getInDemandOccupations,
  getOccupationDetail,
  getAllCertificates,
}: RouterActions): Router => {
  const router = Router();

  /**
   * 
   */
  router.get("/ce/getallcredentials/:skip/:take/:sort/:cancel", async (req: Request, res: Response<AxiosResponse>) => {
    
    getAllCertificates(req.query.query as string)
      .then(async (allCertificates: AxiosResponse) => {

        const gateway = `/assistant/search/ctdl`;

        await api.request({
          url: `${gateway}`,
          method: 'post',
          data: {
            'Query': req.body,
            'Skip': req.params.skip,
            'Take': req.params.take,
            'Sort': req.params.sort
          },
          // retrieving the signal value by using the property name
          // signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
          
        })
        // .then(allCertificates => res.status(200).json(allCertificates))
        // .catch(e => next(e));

        res.status(200).json(allCertificates);

      })
      .catch((e) => res.status(500).send(e));
  });

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

  return router;
};
