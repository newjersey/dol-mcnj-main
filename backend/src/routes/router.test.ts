import request from "supertest";
import express, { Express, Router } from "express";
import { routerFactory } from "./router";
import { buildProgram } from "../test-helpers/factories";

describe("router", () => {
  let app: Express;
  let router: Router;
  const stubFindAllPrograms = jest.fn();

  beforeEach(() => {
    router = routerFactory({ findAllPrograms: stubFindAllPrograms });
    app = express();
    app.use(router);
  });

  it("sends list of program names from data client", (done) => {
    const programs = [buildProgram({}), buildProgram({})];
    stubFindAllPrograms.mockImplementationOnce(() => Promise.resolve(programs));
    request(app)
      .get("/programs")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(programs);
        done();
      });
  });

  it("sends a 500 when the data client fails", (done) => {
    stubFindAllPrograms.mockImplementationOnce(() => Promise.reject());
    request(app).get("/programs").expect(500).end(done);
  });
});
