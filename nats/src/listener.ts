import nats, { Stan } from "node-nats-streaming";
import "colors";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const client: Stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", (conn) => {
  console.log(
    `Listener`.green.bold,
    `Connected To NATS`.yellow.bold,
    `on clientID ${conn.clientID}`.green.bold
  );

  client.on("close", () => {
    console.log("NATS connection closed".yellow.bold);
  });

  client.on("ticket:created", (data) => {
    console.log(data);
  });

  new TicketCreatedListener(client).listen();
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
