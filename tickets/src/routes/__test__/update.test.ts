import request from "supertest";
import { app } from "../../app";
import { Types } from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

jest.mock("../../nats-wrapper");

it("returns a 404 if the provided id was not found", async () => {
  await request(app)
    .put(`/api/tickets/${new Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signin())
    .send({ title: "ksldjf", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/${new Types.ObjectId().toHexString()}`)
    .send({ title: "ksldjf", price: 20 })
    .expect(401);
});

it("returns a 404 if the user does not owan the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "dlahsd",
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "dlshfds",
      price: 1000,
    })
    .expect(401);
});

it("return s a 400 if the title or price is invalid", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "dlahsd",
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -20,
    })
    .expect(400);
});

it("Update The Ticket With Valid Input", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "dlahsd",
      price: 10,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});

it("Publishes An Event", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "dlahsd",
      price: 10,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
