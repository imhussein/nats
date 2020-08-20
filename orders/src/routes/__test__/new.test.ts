import request from "supertest";
import { app } from "../../app";
import { Types } from "mongoose";
import { Ticket } from "../../../models/Ticket";
import { Order } from "../../../models/Order";
import { OrderStatus } from "@mhticketsss/common";
import { natsWrapper } from "../../nats-wrapper";

jest.mock("../../nats-wrapper");

it("returns an error if the ticket doesn't exists", async () => {
  const ticketId = Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.buildTicket({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.buildOrder({
    ticket,
    userId: "fdjalhfa",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.buildTicket({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it("publish an event", async () => {
  const ticket = Ticket.buildTicket({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
