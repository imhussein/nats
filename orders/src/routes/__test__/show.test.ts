import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../../models/Ticket";

jest.mock("../../nats-wrapper");

it("fetches the order", async () => {
  const ticket = Ticket.buildTicket({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);
});
