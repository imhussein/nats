import { Document, Model, Schema, model } from "mongoose";
import { OrderStatus } from "@mhticketsss/common";
import { TicketDoc } from "./Ticket";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends Model<OrderDoc> {
  buildOrder(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User Id is required"],
      validate: {
        validator: (userID: string) => {
          if (!userID) {
            return false;
          } else {
            return true;
          }
        },
        message: "User ID is required",
      },
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      validate: {
        validator: (status: string) => {
          if (!status) {
            return false;
          } else {
            return true;
          }
        },
        message: "Status is reuqired",
      },
      enum: Object.values(OrderStatus),
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.statics.buildOrder = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = model<OrderDoc, OrderModel>("orders", orderSchema, "Orders");
export { Order };
