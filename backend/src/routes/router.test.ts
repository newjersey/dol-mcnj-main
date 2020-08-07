import request from "supertest";
import express, { Express, Router } from "express";
import { routerFactory } from "./router";
import { buildTraining, buildTrainingResult } from "../test-objects/factories";
import { Error } from "../domain/Error";

describe("router", () => {
  let app: Express;
  let router: Router;
  let stubSearchTrainings: jest.Mock;
  let stubFindTrainingById: jest.Mock;

  beforeEach(() => {
    stubSearchTrainings = jest.fn();
    stubFindTrainingById = jest.fn();

    router = routerFactory({
      searchTrainings: stubSearchTrainings,
      findTrainingById: stubFindTrainingById,
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
    it("fetches for id and returns list of matching trainings", (done) => {
      const training = buildTraining({});
      stubFindTrainingById.mockImplementationOnce(() => Promise.resolve(training));
      request(app)
        .get("/trainings/12345")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual(training);
          expect(stubFindTrainingById).toHaveBeenCalledWith("12345");
          done();
        });
    });

    it("sends a 500 when the fetch fails", (done) => {
      stubFindTrainingById.mockImplementationOnce(() => Promise.reject());
      request(app).get("/trainings/systemerror").expect(500).end(done);
    });

    it("sends a 404 when the fetch fails with a Not Found error", (done) => {
      stubFindTrainingById.mockImplementationOnce(() => Promise.reject(Error.NOT_FOUND));
      request(app).get("/trainings/notfounderror").expect(404).end(done);
    });
  });
});
