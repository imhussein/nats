import request from "supertest";
import { app } from "../../app";

it("fails when  email doesn't exists supllied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "mohamed@gmail.com",
      password: "123456",
    })
    .expect(400);
});

it("fails when incorrect password is supllied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "mohamed@gmail.com",
      password: "123456",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "mohamed@gmail.com",
      password: "123456",
    })
    .expect(200);
});

it("responses with a cookie when correct credentials is supllied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "mohamed@gmail.com",
      password: "123456",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "mohamed@gmail.com",
      password: "123456",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
