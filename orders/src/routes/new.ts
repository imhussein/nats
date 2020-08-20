import { Router, Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from "@mhticketsss/common";
import { body } from "express-validator";
import { Types } from "mongoose";
import { Ticket } from "../../models/Ticket";
import { Order } from "../../models/Order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 16;

const router = Router();

router.post(
  "/api/orders",
  [requireAuth],
  [
    body("ticketId")
      .notEmpty()
      .withMessage("Id must be provided")
      .custom((value) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          throw new Error("Id Is not valid");
        }
      }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId: _id } = req.body;
    const ticket = await Ticket.findOne({
      _id,
    });
    if (!ticket) {
      throw new NotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    const order = Order.buildOrder({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as newRouter };
