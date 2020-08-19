import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client(): Stan {
    if (!this._client) {
      throw new Error(
        "Can't access nats client before connecting to nats streaming!!"
      );
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log(`Connected To Nats`);
        resolve();
      });
      this._client!.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
