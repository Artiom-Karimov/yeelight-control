import { FeedbackParser } from '../../utils/feedback-value-parser';
import { DeviceState } from '../dto/device-state';

export class Notification {
  private readonly _state: DeviceState;
  get state(): DeviceState {
    return { ...this._state };
  }

  constructor(raw: string) {
    const data = JSON.parse(raw);
    if (!data.method || data.method !== 'props')
      throw new Error(`No method in notification, ${raw}`);

    if (!data.params) throw new Error(`No params in notification: ${raw}`);

    this._state = new FeedbackParser().parseState(data.params);
  }
}
