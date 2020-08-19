import { Publisher, TicketUpdatedEvent, Subjects } from "@mhticketsss/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
