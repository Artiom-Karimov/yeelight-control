import { Feature } from '../feature';
import { Command, CommandData } from './command';
import { CommandId } from './command-id';

export class SetTemperatureCommand implements Command {
  private readonly feature = Feature.set_ct_abx;
  private readonly id = CommandId.next();
  private readonly value: number;
  private readonly effect: Effect;
  private readonly duration: number;

  constructor(value: number, effect = Effect.smooth, duration = 500) {
    if (value < 1700 || value > 6500)
      throw new Error(`Wrong temperature: ${value}`);

    if (duration < 30) duration = 30;

    this.value = value;
    this.effect = effect;
    this.duration = duration;
  }

  get data(): CommandData {
    return {
      id: this.id,
      method: this.feature,
      params: [this.value, this.effect, this.duration],
    };
  }
}

export enum Effect {
  sudden = 'sudden',
  smooth = 'smooth',
}
