import request from "supertest";
import express, { Express, Router } from "express";
import { routerFactory } from "./router";
import { buildProgram } from "../test-helpers/factories";

describe("router", () => {
  let app: Express;
  let router: Router;
  let stubFindAllPrograms: jest.Mock;
  let stubSearchPrograms: jest.Mock;

  beforeEach(() => {
    stubFindAllPrograms = jest.fn();
    stubSearchPrograms = jest.fn();

    router = routerFactory({
      findAllPrograms: stubFindAllPrograms,
      searchPrograms: stubSearchPrograms,
    });
    app = express();
    app.use(router);
  });

  describe("/programs", () => {
    it("sends list of programs from data client", (done) => {
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

  describe("/programs/search", () => {
    it("calls data client with query and returns list of matching programs", (done) => {
      const programs = [buildProgram({}), buildProgram({})];
      stubSearchPrograms.mockImplementationOnce(() => Promise.resolve(programs));
      request(app)
        .get("/programs/search?query=penguins")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual(programs);
          expect(stubSearchPrograms).toHaveBeenCalledWith("penguins");
          done();
        });
    });

    it("finds all programs when search query parameter is missing", (done) => {
      const programs = [buildProgram({}), buildProgram({})];
      stubFindAllPrograms.mockImplementationOnce(() => Promise.resolve(programs));
      request(app)
        .get("/programs/search?query=")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toEqual(programs);
          expect(stubFindAllPrograms).toHaveBeenCalled();
          expect(stubSearchPrograms).not.toHaveBeenCalled();
          done();
        });
    });

    it("sends a 500 when the data client fails", (done) => {
      stubSearchPrograms.mockImplementationOnce(() => Promise.reject());
      request(app).get("/programs/search?query=badQuery").expect(500).end(done);
    });
  });
});
