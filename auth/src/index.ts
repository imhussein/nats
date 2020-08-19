import mongoose from "mongoose";
import { app } from "./app";
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

app.listen(port, () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT Key Must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI must be defined");
  }
  console.log(`Listening on port ${port}`.green);
});
