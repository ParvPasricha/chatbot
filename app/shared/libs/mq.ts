import { EventEmitter } from 'events';

export type QueueMessage<TPayload> = {
  id: string;
  tenantId: string;
  payload: TPayload;
};

type QueueHandler<TPayload> = (message: QueueMessage<TPayload>) => Promise<void> | void;

class InMemoryQueue extends EventEmitter {
  publish<TPayload>(queue: string, message: QueueMessage<TPayload>) {
    setImmediate(() => this.emit(queue, message));
  }

  consume<TPayload>(queue: string, handler: QueueHandler<TPayload>) {
    this.on(queue, async (message: QueueMessage<TPayload>) => {
      await handler(message);
    });
  }
}

export const mq = new InMemoryQueue();
