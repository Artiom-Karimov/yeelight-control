import { Feature } from '../enums/feature';
import { BaseCommand, CommandData } from './command';
import { Effect } from '../enums/effect';

export class SetRgbCommand extends BaseCommand {
  private readonly value: number;
  private readonly effect: Effect;
  private readonly duration: number;

  constructor(
    device: number,
    value: number,
    effect = Effect.smooth,
    duration = 500,
  ) {
    super(device, Feature.set_rgb);

    if (value < 0 || value > 0xffffff)
      throw new Error(`Wrong color value: ${value.toString(16)}`);

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
}
