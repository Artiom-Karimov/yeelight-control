import { FeedbackParser } from '../../../utils/feedback-value-parser';
import { Device } from 'src/device/device';
import { RawDeviceState } from '../../dto/device-state';
import { Feature } from '../../enums/feature';
import { Param } from '../../enums/param';
import { CommandData } from '../command';
import { BaseCommand } from '../base-command';
import { Response } from '../response';

export class GetPropCommand extends BaseCommand {
  constructor(
    device: Device,
    private readonly params: Param[],
  ) {
    super(device, Feature.get_prop);
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [...(this.params as string[])],
    };
  }

  protected feedback({ result }: Response): void {
    if (!result || result.length !== this.params.length)
      throw new Error(
        `Response does not match command: ${JSON.stringify(result)}`,
      );

    const state: RawDeviceState = {};
    for (let i = 0; i < this.params.length; i++) {
      state[this.params[i]] = result[i];
    }
    const parsed = new FeedbackParser().parseState(state);
    this.device.update(parsed);
  }
}
