import express, { json, Request, Response } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import "colors";
import { errorHandler, NotFoundError, currentuser } from "@mhticketsss/common";
import { newTicket } from "./routes/new";
import { showRouter } from "./routes/show";
import { indexRouter } from "./routes";
import { updateRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentuser);
app.use(showRouter);
app.use(newTicket);
app.use(indexRouter);
app.use(updateRouter);

app.use("**", (req: Request, res: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
