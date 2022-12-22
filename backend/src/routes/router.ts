import { Request, Response, Router } from "express";
import {
  FindTrainingsBy,
  GetInDemandOccupations,
  SearchTrainings,
  GetOccupationDetail,
  GetAllCertificates,
} from "../domain/types";
import { Error } from "../domain/Error";
import { Occupation, OccupationDetail } from "../domain/occupations/Occupation";
import { Certificates } from "../domain/credentialengine/CredentialEngineInterface";
import { Training } from "../domain/training/Training";
import { TrainingResult } from "../domain/training/TrainingResult";
import { Selector } from "../domain/training/Selector";

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
  router.get("/ce/getallcredentials/:skip/:take/:sort/:cancel", async (req: Request, res: Response<Certificates>) => {    
    getAllCertificates( req.params.skip as unknown as number, req.params.take as unknown as number, req.params.sort as string, req.params.cancel as unknown as boolean )
      .then(( certificates: Certificates ) => {
        res.status( 200 ).json( certificates );
      })
      .catch(( e ) => res.status( 500 ).send( e ));
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
