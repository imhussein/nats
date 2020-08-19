import { Router, Request, Response } from "express";
import { requireAuth, validateRequest } from "@mhticketsss/common";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").notEmpty().withMessage("title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be grater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.buildTicket({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    });
    res.status(201).send(ticket);
  }
);

export { router as newTicket };
