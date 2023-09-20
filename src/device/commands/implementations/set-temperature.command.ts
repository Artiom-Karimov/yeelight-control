import { Feature } from '../../enums/feature';
import { Effect } from '../../enums/effect';
import { BaseCommand, CommandData } from '../command';
import { Device } from '../../device';
import { Response } from '../response';

export class SetTemperatureCommand extends BaseCommand {
  constructor(
    device: Device,
    private readonly value: number,
    private readonly effect = Effect.smooth,
    private readonly duration = 500,
  ) {
    super(device, Feature.set_ct_abx);

    if (value < 1700 || value > 6500)
      throw new Error(`Wrong temperature: ${value}`);

    if (this.duration < 30) this.duration = 30;
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [this.value, this.effect, this.duration],
    };
  }

  response(response: Response): boolean {
    if (!this.matches(response)) return false;
    if (!response.success)
      throw new Error(`Command failed: ${JSON.stringify(response.error)}`);

    this.feedback();
    return true;
  }

  private feedback(): void {
    this.device.update({ ct: this.value });
  }
}
