import { BaseCommand, CommandData } from '../command';
import { Device } from '../../device';
import { RgbInput } from '../../dto/command-input';
import { Feature } from '../../enums/feature';
import { Effect } from '../../enums/string-values';

export class RgbCommand extends BaseCommand {
  private readonly value: number;
  private readonly effect: Effect;
  private readonly duration: number;

  constructor(device: Device, { value, effect, duration, feature }: RgbInput) {
    super(device, feature);

    if (value < 0 || value > 0xffffff)
      throw new Error(
        `Wrong color value: ${value.toString(16).padStart(6, '0')}`,
      );

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
    if (this.feature === Feature.set_rgb)
      return this.device.update({ rgb: this.value });

    if (this.feature === Feature.bg_set_rgb)
      return this.device.update({ bg_rgb: this.value });
  }
}
