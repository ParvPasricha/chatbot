import { EventEmitter } from 'events';
import { systemLogger } from './logger';

type TelemetryEvent =
  | 'conversation_started'
  | 'intent_classified'
  | 'tool_invoked'
  | 'answer_generated'
  | 'lead_created'
  | 'escalation_triggered'
  | 'feedback_collected';

export type TelemetryPayload = Record<string, unknown> & { tenantId: string; event: TelemetryEvent };

class Telemetry extends EventEmitter {
  track(payload: TelemetryPayload) {
    this.emit('event', payload);
    systemLogger.debug({ payload }, 'telemetry event');
  }

  onEvent(handler: (payload: TelemetryPayload) => void) {
    this.on('event', handler);
  }
}

export const telemetry = new Telemetry();
