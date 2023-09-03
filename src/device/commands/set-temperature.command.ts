import { Feature } from '../feature';
import { BaseCommand, CommandData } from './command';

export class SetTemperatureCommand extends BaseCommand {
  private readonly value: number;
  private readonly effect: Effect;
  private readonly duration: number;

  constructor(
    device: number,
    value: number,
    effect = Effect.smooth,
    duration = 500,
  ) {
    super(device, Feature.set_ct_abx);

    if (value < 1700 || value > 6500)
      throw new Error(`Wrong temperature: ${value}`);

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

export enum Effect {
  sudden = 'sudden',
  smooth = 'smooth',
}
