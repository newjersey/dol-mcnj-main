import app from "./app";
import request from "supertest";

describe('router', () => {
    it('sends pong from ping endpoint', (done) => {
        request(app)
            .get("/api/ping")
            .then(response => {
                expect(response.body.message).toEqual("pong");
                done();
            });
    })
});