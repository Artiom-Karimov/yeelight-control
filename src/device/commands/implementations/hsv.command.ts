import { BaseCommand, CommandData } from '../command';
import { Device } from '../../device';
import { Response } from '../response';
import { HsvInput } from '../../dto/command-input';
import { Feature } from '../../enums/feature';
import { Effect } from '../../enums/string-values';

export class HsvCommand extends BaseCommand {
  private readonly hue: number;
  private readonly sat: number;
  private readonly effect: Effect;
  private readonly duration: number;

  constructor(
    device: Device,
    { hue, sat, effect, duration, feature }: HsvInput,
  ) {
    super(device, feature);

    if (hue < 0 || hue > 359) throw new Error(`Wrong hue value: ${hue}`);
    if (sat < 0 || sat > 100) throw new Error(`Wrong sat value: ${sat}`);

    if (duration == null) duration = 500;
    if (duration < 30) duration = 30;

    this.hue = hue;
    this.sat = sat;
    this.effect = effect || 'smooth';
    this.duration = duration;
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [this.hue, this.sat, this.effect, this.duration],
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
    if (this.feature === Feature.set_hsv)
      return this.device.update({ hue: this.hue, sat: this.sat });

    if (this.feature === Feature.bg_set_hsv)
      return this.device.update({ bg_hue: this.hue, bg_sat: this.sat });
  }
}
