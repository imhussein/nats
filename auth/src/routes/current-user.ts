import { Router, Request, Response } from "express";
import { currentuser } from "@mhticketsss/common";

const router: Router = Router();

router.get(
  "/api/users/currentuser",
  currentuser,
  ({ currentUser }: Request, res: Response) => {
    res.send({ currentUser });
  }
);

export { router as currentUserRouter };
