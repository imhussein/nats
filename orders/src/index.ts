import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
const port = process.env.PORT || 3000;

async function connectToDB() {
  try {
    const conn: typeof mongoose = await mongoose.connect(
      process.env.MONGO_URI!,
      { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true }
    );
    console.log(`DB Connected at host ${conn.connection.host}`.green.bold);
  } catch (error) {
    throw new Error(error);
  }
}

connectToDB();

async function connectToNATS() {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
  } catch (error) {
    throw new Error(error);
  }
}

connectToNATS();

app.listen(port, () => {
  natsWrapper.client.on("close", () => {
    console.log("Nats Connection closed!!");
    process.exit();
  });
  process.on("SIGINT", () => natsWrapper.client.close());
  process.on("SIGTERM", () => natsWrapper.client.close());
  if (!process.env.JWT_KEY) {
    throw new Error("JWT Key Must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Nats Client ID must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Nats Cluster ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL Not must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI must be defined");
  }
  console.log(`Listening on port ${port}`.green);
});
