import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "1237fhdksj";
  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();
  await mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const email = "test@test.com",
    id = new mongoose.Types.ObjectId().toHexString(),
    payload = {
      email,
      id,
    },
    token = jwt.sign(payload, process.env.JWT_KEY!),
    session = { jwt: token },
    sessionJSON = JSON.stringify(session),
    Base64Session = Buffer.from(sessionJSON).toString("base64");
  return [`express:sess=${Base64Session}`];
};
