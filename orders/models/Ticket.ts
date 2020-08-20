import { Model, Document, Schema, model } from "mongoose";
import { OrderStatus } from "@mhticketsss/common";
import { Order } from "./Order";

interface TicketAttrs {
  title: string;
  price: number;
}

interface TicketDoc extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
  buildTicket(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      validate: {
        validator: (title: string) => {
          if (!title) {
            return false;
          } else {
            return true;
          }
        },
        message: "Title is required",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      validate: {
        validator: (price: number) => {
          if (!price) {
            return false;
          } else {
            return true;
          }
        },
        message: "Price is required and must be posttive value",
      },
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.buildTicket = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema, "Ticket");
export { Ticket, TicketDoc };
