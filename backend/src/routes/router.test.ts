import request from "supertest";
import express, { Express, Router } from "express";
import { routerFactory } from "./router";
import { buildTrainingResult } from "../test-helpers/factories";

describe("router", () => {
  let app: Express;
  let router: Router;
  let stubSearchTrainings: jest.Mock;

  beforeEach(() => {
    stubSearchTrainings = jest.fn();

    router = routerFactory({
      searchTrainings: stubSearchTrainings,
    });
    app = express();
    app.use(router);
  });

  describe("/trainings/search", () => {
    it("calls data client with query and returns list of matching trainings", (done) => {
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

    it("sends a 500 when the data client fails", (done) => {
      stubSearchTrainings.mockImplementationOnce(() => Promise.reject());
      request(app).get("/trainings/search?query=badQuery").expect(500).end(done);
    });
  });
});
