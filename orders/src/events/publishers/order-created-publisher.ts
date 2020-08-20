import { Publisher, OrderCreatedEvent, Subjects } from "@mhticketsss/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
