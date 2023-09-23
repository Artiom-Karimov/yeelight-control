import { CommandData } from '../command';
import { BaseCommand } from '../base-command';
import { Device } from '../../device';
import { BrightInput } from '../../dto/command-input';
import { Feature } from '../../enums/feature';
import { Effect } from '../../enums/string-values';

export class BrightCommand extends BaseCommand {
  private readonly value: number;
  private readonly effect: Effect;
  private readonly duration: number;

  constructor(
    device: Device,
    { value, effect, duration, feature }: BrightInput,
  ) {
    super(device, feature);

    if (value < 0 || value > 100)
      throw new Error(`Wrong brightness value: ${value}`);

    if (duration == null) duration = 500;
    if (duration < 30) duration = 30;

    this.value = value;
    this.effect = effect || 'smooth';
    this.duration = duration;
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [this.value, this.effect, this.duration],
    };
  }

  protected feedback(): void {
    if (this.feature === Feature.set_bright)
      return this.device.update({ bright: this.value });

    if (this.feature === Feature.bg_set_bright)
      return this.device.update({ bg_bright: this.value });
  }
}
