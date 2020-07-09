import request from "supertest";
import express, { Express, Router } from "express";
import { routerFactory } from "./router";
import { buildTraining } from "../test-helpers/factories";

describe("router", () => {
  let app: Express;
  let router: Router;
  let stubFindAllTrainings: jest.Mock;
  let stubSearchTrainings: jest.Mock;

  beforeEach(() => {
    stubFindAllTrainings = jest.fn();
    stubSearchTrainings = jest.fn();

    router = routerFactory({
      findAllTrainings: stubFindAllTrainings,
      searchTrainings: stubSearchTrainings,
    });
    app = express();
    app.use(router);
  });

  describe("/trainings", () => {
    it("sends list of trainings from data client", (done) => {
      const trainings = [buildTraining({}), buildTraining({})];
      stubFindAllTrainings.mockImplementationOnce(() => Promise.resolve(trainings));
      request(app)
        .get("/trainings")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual(trainings);
          done();
        });
    });

    it("sends a 500 when the data client fails", (done) => {
      stubFindAllTrainings.mockImplementationOnce(() => Promise.reject());
      request(app).get("/trainings").expect(500).end(done);
    });
  });

  describe("/trainings/search", () => {
    it("calls data client with query and returns list of matching trainings", (done) => {
      const trainings = [buildTraining({}), buildTraining({})];
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

    it("finds all trainings when search query parameter is missing", (done) => {
      const trainings = [buildTraining({}), buildTraining({})];
      stubFindAllTrainings.mockImplementationOnce(() => Promise.resolve(trainings));
      request(app)
        .get("/trainings/search?query=")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual(trainings);
          expect(stubFindAllTrainings).toHaveBeenCalled();
          expect(stubSearchTrainings).not.toHaveBeenCalled();
          done();
        });
    });

    it("sends a 500 when the data client fails", (done) => {
      stubSearchTrainings.mockImplementationOnce(() => Promise.reject());
      request(app).get("/trainings/search?query=badQuery").expect(500).end(done);
    });
  });
});
