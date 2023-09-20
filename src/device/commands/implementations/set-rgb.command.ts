import { Feature } from '../../enums/feature';
import { BaseCommand, CommandData } from '../command';
import { Effect } from '../../enums/effect';
import { Device } from '../../device';
import { Response } from '../response';

export class SetRgbCommand extends BaseCommand {
  private readonly value: number;
  private readonly effect: Effect;
  private readonly duration: number;

  constructor(
    device: Device,
    value: number,
    effect = Effect.smooth,
    duration = 500,
  ) {
    super(device, Feature.set_rgb);

    if (value < 0 || value > 0xffffff)
      throw new Error(
        `Wrong color value: ${value.toString(16).padStart(6, '0')}`,
      );

    if (duration < 30) duration = 30;

    this.value = value;
    this.effect = effect;
    this.duration = duration;
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
    this.device.update({ rgb: this.value });
  }
}
