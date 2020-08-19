import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/User";
import http_status_codes from "http-status-codes";
import { BadRequestError, validateRequest } from "@mhticketsss/common";
import jsonwebtoken from "jsonwebtoken";

const router: Router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new BadRequestError("Email is already taken");
    }

    const user = await User.buildUser({ email, password });
    await user.save();
    const userToken = jsonwebtoken.sign(
      { email: user.email, id: user.id },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userToken,
    };
    res.status(http_status_codes.CREATED).json(user);
  }
);

export { router as signupRouter };
