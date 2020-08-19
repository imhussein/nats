import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@mhticketsss/common";
import { User } from "../models/User";
import { Password } from "../services/password";
import jsonwebtoken from "jsonwebtoken";

const router: Router = Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must apply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Password Supplied");
    }

    const userToken = jsonwebtoken.sign(
      { email: existingUser.email, id: existingUser.id },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userToken,
    };

    res.status(200).json(existingUser);
  }
);

export { router as signinRouter };
