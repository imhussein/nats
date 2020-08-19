import request from "supertest";
import { app } from "../../app";

it("response with details about currentuser", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send({})
    .set("Cookie", await global.signin())
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body).toEqual({});
});
