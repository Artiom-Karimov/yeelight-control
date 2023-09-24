import { CommandData } from '../command';
import { BaseCommand } from '../base-command';
import { Device } from '../../device';
import { ColorTempInput } from '../../dto/command-input';
import { Feature } from '../../enums/feature';
import { Effect } from '../../enums/string-values';

export class ColorTempCommand extends BaseCommand {
  private readonly value: number;
  private readonly effect: Effect;
  private readonly duration: number;

  constructor(
    device: Device,
    { value, effect, duration, feature }: ColorTempInput,
  ) {
    super(device, feature);

    if (value < 1700 || value > 6500)
      throw new Error(`Wrong temperature: ${value}`);

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
    if (this.feature === Feature.set_ct_abx)
      return this.device.update({ ct: this.value });
    if (this.feature === Feature.bg_set_ct_abx)
      return this.device.update({ bg_ct: this.value });
  }
}
