import request from "supertest";
import express, { Express, Router } from "express";
import { routerFactory } from "./router";
import { Error } from "../domain/Error";
import {
  buildInDemandOccupation,
  buildOccupationDetail,
  buildTraining,
  buildTrainingResult,
} from "../domain/test-objects/factories";
import { Selector } from "../domain/training/Selector";

describe("router", () => {
  let app: Express;
  let router: Router;
  let stubSearchTrainings: jest.Mock;
  let stubFindTrainingsBy: jest.Mock;
  let stubGetInDemandOccupations: jest.Mock;
  let stubGetOccupationDetail: jest.Mock;
  let stubGetContentfulFAQ: jest.Mock;
  let stubGetContentfulTPR: jest.Mock;
  let stubGetContentfulFRP: jest.Mock;
  let stubGetContentfulGNav: jest.Mock;
  let stubGetContentfulMNav: jest.Mock;
  let stubGetContentfulFootNav: jest.Mock;
  let stubGetContentfulFootNav2: jest.Mock;

  beforeEach(() => {
    stubSearchTrainings = jest.fn();
    stubFindTrainingsBy = jest.fn();
    stubGetInDemandOccupations = jest.fn();
    stubGetOccupationDetail = jest.fn();
    stubGetContentfulFAQ = jest.fn();
    stubGetContentfulTPR = jest.fn();
    stubGetContentfulFRP = jest.fn();
    stubGetContentfulGNav = jest.fn();
    stubGetContentfulMNav = jest.fn();
    stubGetContentfulFootNav = jest.fn();
    stubGetContentfulFootNav2 = jest.fn();

    router = routerFactory({
      searchTrainings: stubSearchTrainings,
      findTrainingsBy: stubFindTrainingsBy,
      getInDemandOccupations: stubGetInDemandOccupations,
      getOccupationDetail: stubGetOccupationDetail,
      getContentfulFAQ: stubGetContentfulFAQ,
      getContentfulTPR: stubGetContentfulTPR,
      getContentfulFRP: stubGetContentfulFRP,
      getContentfulGNav: stubGetContentfulGNav,
      getContentfulMNav: stubGetContentfulMNav,
      getContentfulFootNav: stubGetContentfulFootNav,
      getContentfulFootNav2: stubGetContentfulFootNav2,
    });
    app = express();
    app.use(router);
  });

  describe("/trainings/search", () => {
    it("searches with query and returns list of matching trainings", (done) => {
      const trainings = [buildTrainingResult({}), buildTrainingResult({})];
      stubSearchTrainings.mockImplementationOnce(() => Promise.resolve(trainings));
      request(app)
        .get("/trainings/search?query=penguins")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual(trainings);
          expect(stubSearchTrainings).toHaveBeenCalledWith("penguins");
          done();
        });
    });

    it("sends a 500 when the search fails", (done) => {
      stubSearchTrainings.mockImplementationOnce(() => Promise.reject());
      request(app).get("/trainings/search?query=badQuery").expect(500).end(done);
    });
  });

  describe("/trainings/{id}", () => {
    it("fetches for first id and returns matching training", (done) => {
      const training = buildTraining({});
      stubFindTrainingsBy.mockResolvedValue([training]);
      request(app)
        .get("/trainings/12345")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual(training);
          expect(stubFindTrainingsBy).toHaveBeenCalledWith(Selector.ID, ["12345"]);
          done();
        });
    });

    it("sends a 500 when the fetch fails", (done) => {
      stubFindTrainingsBy.mockImplementationOnce(() => Promise.reject());
      request(app).get("/trainings/systemerror").expect(500).end(done);
    });

    it("sends a 404 when the fetch fails with a Not Found error", (done) => {
      stubFindTrainingsBy.mockImplementationOnce(() => Promise.reject(Error.NOT_FOUND));
      request(app).get("/trainings/notfounderror").expect(404).end(done);
    });

    it("sends a 404 when the id does not exist", (done) => {
      request(app).get("/trainings/").expect(404).end(done);
    });
  });

  describe("/occupations", () => {
    it("fetches in demand occupations", (done) => {
      const occupations = [buildInDemandOccupation({})];
      stubGetInDemandOccupations.mockImplementationOnce(() => Promise.resolve(occupations));
      request(app)
        .get("/occupations")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual(occupations);
          expect(stubGetInDemandOccupations).toHaveBeenCalled();
          done();
        });
    });

    it("sends a 500 when the fetch fails", (done) => {
      stubGetInDemandOccupations.mockImplementationOnce(() => Promise.reject());
      request(app).get("/occupations").expect(500).end(done);
    });
  });

  describe("/occupations/{soc}", () => {
    it("calls the oNET client for occupation code", (done) => {
      const detail = buildOccupationDetail({});

      stubGetOccupationDetail.mockResolvedValue(detail);
      request(app)
        .get("/occupations/17-2051")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual(detail);
          expect(stubGetOccupationDetail).toHaveBeenCalledWith("17-2051");
          done();
        });
    });

    it("rejects on failure", (done) => {
      stubGetOccupationDetail.mockRejectedValue({});
      request(app).get("/occupations/17-2051").expect(500).end(done);
    });
  });
});
