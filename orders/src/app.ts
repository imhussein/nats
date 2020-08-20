import express, { json, Request, Response } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import "colors";
import { errorHandler, NotFoundError, currentuser } from "@mhticketsss/common";
import { showRouter } from "./routes/show";
import { indexRouter } from "./routes";
import { deleteRouter } from "./routes/delete";
import { newRouter } from "./routes/new";

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
app.use(indexRouter);
app.use(deleteRouter);
app.use(newRouter);

app.use("**", (req: Request, res: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
