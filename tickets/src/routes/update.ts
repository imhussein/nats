import { Router, Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  validateRequest,
} from "@mhticketsss/common";
import { Ticket } from "../models/Ticket";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat().withMessage("title must be more than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.send(ticket);
  }
);

export { router as updateRouter };
