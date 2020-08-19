import express, { json, Request, Response } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import "colors";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@mhticketsss/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use("**", (req: Request, res: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
