import { Publisher, OrderCanacelledEvent, Subjects } from "@mhticketsss/common";

export class OrderCancelledPublisher extends Publisher<OrderCanacelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
