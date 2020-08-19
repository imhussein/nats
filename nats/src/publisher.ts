import nats, { Stan } from "node-nats-streaming";
import "colors";
import { randomBytes } from "crypto";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const client: Stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", async (conn) => {
  console.log(
    `Publisher`.green.bold,
    `Connected To NATS Server`.yellow.bold,
    `on clientID ${conn.clientID}`.green.bold
  );

  try {
    await new TicketCreatedPublisher(client).publish({
      id: "123",
      title: "movie",
      price: 1000,
    });
  } catch (error) {
    console.error(error);
  }
});
