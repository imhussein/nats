import { Schema, Model, Document, model } from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends Model<TicketDocument> {
  buildTicket: (attrs: TicketAttrs) => TicketDocument;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is requied"],
      validate: {
        validator: (title: string) => {
          if (!title) return false;
          return true;
        },
        message: "Title is required",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      validate: {
        validator: (price: number) => {
          if (price < 0) return false;
          return true;
        },
        message: "Price is required",
      },
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketSchema.statics.buildTicket = (attrs: TicketAttrs) => new Ticket(attrs);

const Ticket = model<TicketDocument, TicketModel>(
  "tickets",
  ticketSchema,
  "Tickets"
);
export { Ticket };
