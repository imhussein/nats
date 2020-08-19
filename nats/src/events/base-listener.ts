import { Stan, Message } from "node-nats-streaming";
import { Subjects } from "./Subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  private client: Stan;
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  protected ackWait = 5 * 1000;
  abstract onMessage(data: T["data"], message: Message): void;
  constructor(client: Stan) {
    this.client = client;
  }
  subscriptionOptios() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptios()
    );
    subscription.on("message", (message: Message) => {
      console.log(
        `Message Recevied ${this.subject} / ${this.queueGroupName}`.green.bold
      );
      const parsedData = this.parseMessage(message);
      this.onMessage(parsedData, message);
    });
  }

  parseMessage(message: Message) {
    const data = message.getData();
    if (typeof data === "string") {
      return JSON.parse(data);
    } else if (data instanceof Buffer) {
      return JSON.parse(data.toString("utf-8"));
    }
  }
}
