import { Publisher, TicketCreatedEvent, Subjects } from "@mhticketsss/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
